// src/app/admin/dashboard/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import DashboardGridClient from '@/components/admin/DashboardGridClient';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. Fetch products where inventory levels are strictly under 5 units
  const rawLowStock = await prisma.product.findMany({
    where: {
      stockQuantity: { lt: 5 },
    },
    orderBy: {
      stockQuantity: 'asc',
    },
  });

  // Safe decimal type parsing configuration
  const lowStockProducts: Product[] = rawLowStock.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }));

  // 2. Aggregate operations metric calculations directly from current states
  // In a full implementation, you would query an 'Order' or 'Transaction' table.
  // We'll calculate mock benchmarks safely mapped to keep compilation seamless.
  const metrics = {
    totalRevenue: 14250.75,
    totalOrders: 312,
    averageOrderValue: 45.67,
    lowStockCount: lowStockProducts.length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardGridClient 
        metrics={metrics} 
        lowStockProducts={lowStockProducts} 
      />
    </main>
  );
}