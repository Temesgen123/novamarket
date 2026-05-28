// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
});

export async function POST(req: Request) {
  // 1. Capture the raw string body and security signature header
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing security signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // 2. Cryptographically verify the event originated directly from Stripe
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // 3. Process targeted payment lifetime execution patterns
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    console.log(`💰 Verified Payment Intent Captured: ${paymentIntent.id}`);

    // Fetch the structural items array passed through the payment intent initialization step
    // In a fully built setup, you can attach order details via metadata or look up an order entry
    try {
      // Execute database mutations safely using an atomic Prisma transaction
      await prisma.$transaction(async (tx) => {
        // Mocking an inventory stock decrement loop based on checkout cart records
        // Replace with your real order-metadata mapping values:
        
        console.log('🔄 Webhook executing inventory reconciliation algorithms...');
        
        // Example execution: Deducting inventory for a specific finalized item
        // tx.product.update({ where: { id: ... }, data: { stockQuantity: { decrement: 1 } } });
      });

      console.log('✅ Inventory levels updated and reconciled successfully.');
    } catch (dbError) {
      console.error('Prisma failed processing inventory updates during webhook trigger:', dbError);
      // Return a 500 status so Stripe knows it needs to retry sending this event later
      return NextResponse.json({ error: 'Inventory update deferral exception' }, { status: 500 });
    }
  }

  // 4. Return an immediate 200 OK acknowledgment to Stripe within 10 seconds
  return NextResponse.json({ received: true }, { status: 200 });
}