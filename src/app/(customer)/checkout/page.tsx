// src/app/(customer)/checkout/page.tsx
import React from 'react';
import CheckoutClient from '@/components/customer/CheckoutClient';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white py-4">
      <CheckoutClient />
    </main>
  );
}
