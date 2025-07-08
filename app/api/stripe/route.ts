import { prodDataItem } from '@/actions/payment';
import { db } from '@/lib/db';
import { Email } from '@/lib/email';
import { stripe } from '@/lib/stripe';
import { OrderStatus } from '@prisma/client';
import { headers } from 'next/headers';

export const POST = async (req: Request) => {
  const body = await req.text();

  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_PAYMENT_WEBHOOK_SECRET as string);
  } catch {
    return new Response(`Webhook Error`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        const prodData: prodDataItem[] = JSON.parse(session.metadata?.prodData as string);

        if (prodData && prodData.length > 0 && session.customer_details?.email) {
          await new Email(session.customer_details?.email).sendEmailProductPurchase(`
          <p>Thank you for your purchase!</p>
          <h1>Product Name: ${prodData[0].prodName}</h1>
          <h2>Total Price: ${paymentIntent.amount}</h2>
          `);

          await Promise.all(
            prodData.map(async (data) => {
              await stripe.transfers.create({
                amount: data.accountFund,
                currency: 'usd',
                destination: data.accountId,
                source_transaction: paymentIntent.latest_charge as string,
              });
            })
          );

          if (session?.metadata?.userId) {
            await db.order.create({
              data: {
                userId: session?.metadata?.userId as string,
                platformFee: Number(session.metadata?.applicationFeeAmount),
                total: paymentIntent.amount,
                status: OrderStatus.completed,
                orderItems: {
                  create: prodData.map((data) => ({
                    productVariantId: data.productVariantId,
                    quantity: data.quantity,
                  })),
                },
              },
            });
          }
        }
        break;
      }
      default: {
        console.log('Unhandled event type:', event.type);
      }
    }
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }

  return new Response(null, { status: 200 });
};
