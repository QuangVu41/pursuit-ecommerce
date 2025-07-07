import { Email } from '@/lib/email';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_PAYMENT_WEBHOOK_SECRET as string);
  } catch {
    return new Response(`Webhook Error`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const prodImage = session.metadata?.prodImage;
      if (session.customer_details?.email)
        await new Email(session.customer_details?.email).sendEmailProductPurchase(`
        <p>Thank you for your purchase!</p>
        <p>Product Image: <img src="${prodImage}" alt="Product Image" style="max-width: 200px; max-height: 200px;" /></p>
        `);

      break;
    }
    default: {
      console.log('Unhandled event type:', event.type);
    }
  }

  return new Response(null, { status: 200 });
}
