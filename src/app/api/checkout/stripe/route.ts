// src/app/api/checkout/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any, // Targets modern API specs
});

export async function POST(req: Request) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart payload is empty' },
        { status: 400 },
      );
    }

    // Calculate total due in the smallest currency unit (cents for USD)
    const totalAmountCents = items.reduce((total, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return total + Math.round(price * 100) * item.quantity;
    }, 0);

    // Create a PaymentIntent with automated payment methods enabled
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        itemCount: items
          .reduce((sum, item) => sum + item.quantity, 0)
          .toString(),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Stripe sandbox intent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
