// src/components/admin/DashboardGridClient.tsx
'use client';

import React from 'react';
import { Product } from '@/types';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockCount: number;
}

interface DashboardGridClientProps {
  metrics: DashboardMetrics;
  lowStockProducts: Product[];
}

export default function DashboardGridClient({ metrics, lowStockProducts }: DashboardGridClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Operations Control Center</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time marketplace health metrics and inventory levels.</p>
      </div>

      {/* 1. High-Level Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Gross Revenue Metric Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-gray-900">${metrics.totalRevenue.toFixed(2)}</span>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-md">Live</span>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-gray-900">{metrics.totalOrders}</span>
            <span className="text-xs font-medium text-gray-400">Captured</span>
          </div>
        </div>

        {/* Average Order Volume Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Order Value</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-gray-900">${metrics.averageOrderValue.toFixed(2)}</span>
            <span className="text-xs font-medium text-gray-400">Basket Meta</span>
          </div>
        </div>

        {/* Active Inventory Alerts Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory Warnings</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-2xl font-black ${metrics.lowStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {metrics.lowStockCount}
            </span>
            {metrics.lowStockCount > 0 && (
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md animate-pulse">
                Action Required
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Critical Low Stock Watchlist */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Critical Stock Watchlist</h3>
            <p className="text-xs text-gray-500 mt-0.5">Catalog items running dangerously close to zero stock units.</p>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            ✅ Perfect! All catalog items meet baseline stock level configurations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Base Price</th>
                  <th className="py-4 px-6 text-right">Units Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 line-clamp-1 max-w-xs">{product.title}</span>
                        <span className="text-xs text-gray-400 font-mono block">ID: {product.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-500">{product.category}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center font-bold px-2.5 py-1 rounded-md text-xs ${
                        product.stockQuantity === 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {product.stockQuantity} Left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}