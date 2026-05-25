// src/app/api/checkout/paypal/route.ts
import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { CartItem } from '@/types';

// Configure the Sandbox execution environment matrix
const Environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!,
);
const client = new paypal.core.PayPalHttpClient(Environment);

export async function POST(req: Request) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    const totalAmount = items
      .reduce((total, item) => {
        const price = item.product.salePrice ?? item.product.price;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount,
          },
        },
      ],
    });

    const order = await client.execute(request);
    return NextResponse.json({ id: order.result.id });
  } catch (error: any) {
    console.error('PayPal sandbox order configuration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
