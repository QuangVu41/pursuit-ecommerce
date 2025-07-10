import { ProdDataItem, ProdDataItemWithCart } from '@/actions/payment';
import { Email } from '@/lib/email';
import { stripe } from '@/lib/stripe';
import { createOrder, createOrderFromCart } from '@/services/orders';
import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
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

        if (session.metadata && session.metadata.userId) {
          if (!session.metadata.isOrderFromCart) {
            const prodData: ProdDataItem = JSON.parse(session.metadata?.prodData as string);
            if (session.customer_details?.email)
              await new Email(session.customer_details?.email).sendEmailProductPurchase(`
              <p>Thank you for your purchase!</p>
              <h1>Product Name: ${prodData.prodName}</h1>
              <h2>Total Price: ${paymentIntent.amount}</h2>
              `);

            await stripe.transfers.create({
              amount: prodData.accountFund,
              currency: 'usd',
              destination: prodData.accountId,
              source_transaction: paymentIntent.latest_charge as string,
            });

            await createOrder({
              data: {
                userId: session?.metadata?.userId as string,
                total: +session.metadata.totalOrder,
                status: OrderStatus.completed,
                orderItems: {
                  create: {
                    productVariantId: prodData.productVariantId,
                    quantity: prodData.quantity,
                    platformFee: prodData.platformFee,
                    total: prodData.totalOrderItem,
                  },
                },
              },
            });
          } else {
            const prodDataWithCart: ProdDataItemWithCart[] = Object.keys(session.metadata).reduce<
              ProdDataItemWithCart[]
            >((acc, key) => {
              if (key.startsWith('prodData')) {
                const item = JSON.parse(session.metadata![key]);
                return [...acc, item];
              }
              return acc;
            }, []);

            await Promise.all(
              prodDataWithCart.map(async (data) => {
                await stripe.transfers.create({
                  amount: data.accountFund,
                  currency: 'usd',
                  destination: data.accountId,
                  source_transaction: paymentIntent.latest_charge as string,
                });
              })
            );

            await createOrderFromCart(
              prodDataWithCart.map((data) => data.cartItemId),
              {
                data: {
                  userId: session?.metadata?.userId as string,
                  total: +session.metadata.totalOrder,
                  status: OrderStatus.completed,
                  orderItems: {
                    create: prodDataWithCart.map((data) => ({
                      productVariantId: data.productVariantId,
                      quantity: data.quantity,
                      platformFee: data.platformFee,
                      total: data.totalOrderItem,
                    })),
                  },
                },
              }
            );
          }
        }
        break;
      }
      default: {
        console.log('Unhandled event type:', event.type);
      }
    }
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error', { status: 500 });
  }

  revalidatePath('/');
  return new Response(null, { status: 200 });
};
