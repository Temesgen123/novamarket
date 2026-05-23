// src/app/(customer)/products/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById } from '@/server/actions/product';
import ProductDetailClient from '@/components/customer/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Resolve params asynchronously as required by Next.js App Router rules
  const resolvedParams = await params;

  if (!resolvedParams.id) {
    notFound();
  }

  // Fetch product data directly via Server Action database call
  const response = await getProductById(resolvedParams.id);

  if (!response.success || !response.data) {
    notFound();
  }

  const product = response.data;

  return (
    <main className="min-h-screen bg-white py-4">
      <ProductDetailClient product={product} />
    </main>
  );
}
