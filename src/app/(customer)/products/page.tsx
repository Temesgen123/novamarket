// src/app/(customer)/products/page.tsx
import React from 'react';
import ProductGridClient from '@/components/customer/ProductGridClient';
import { getProducts } from '@/server/actions/product';
import { prisma } from '@/lib/prisma';

// Force dynamic execution to guarantee fresh product inventories
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // 1. Fetch initial products database array matching default sorting parameters
  const catalogResponse = await getProducts({
    page: 1,
    limit: 20,
    sortBy: 'latest',
  });

  // 2. Fetch distinct categorical lists for the filter sidebar menu dropdown
  const distinctCategories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  const categories = distinctCategories.map((item) => item.category);
  const initialProducts =
    catalogResponse.success && catalogResponse.data
      ? catalogResponse.data.products
      : [];

  return (
    <main className="min-h-screen bg-white pt-4">
      <ProductGridClient
        initialProducts={initialProducts}
        categories={categories}
      />
    </main>
  );
}
