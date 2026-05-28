// src/app/admin/dashboard/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import DashboardGridClient from '@/components/admin/DashboardGridClient';
import AddProductForm from '@/components/admin/AddProductForm'; // <-- Import the new product creator form
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const rawLowStock = await prisma.product.findMany({
    where: { stockQuantity: { lt: 5 } },
    orderBy: { stockQuantity: 'asc' },
  });

  const lowStockProducts: Product[] = rawLowStock.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }));

  const metrics = {
    totalRevenue: 14250.75,
    totalOrders: 312,
    averageOrderValue: 45.67,
    lowStockCount: lowStockProducts.length,
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* 1. Core Analytics Cards & Warning Arrays */}
      <DashboardGridClient 
        metrics={metrics} 
        lowStockProducts={lowStockProducts} 
      />

      {/* 2. Interactive Product Insertion Console Section */}
      <div className="mt-8 border-t border-gray-200 pt-8 px-4 sm:px-6 lg:px-8">
        <AddProductForm />
      </div>
    </main>
  );
}