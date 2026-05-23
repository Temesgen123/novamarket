// src/components/customer/ProductGridClient.tsx
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { getProducts, GetProductsFilters } from '@/server/actions/product';

interface ProductGridClientProps {
  initialProducts: Product[];
  categories: string[];
}

export default function ProductGridClient({
  initialProducts,
  categories,
}: ProductGridClientProps) {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<GetProductsFilters>({
    search: '',
    category: 'All',
    sortBy: 'latest',
  });

  const [isPending, startTransition] = useTransition();

  // Trigger dynamic server action calls when filters mutate
  const handleFilterChange = (newFilters: Partial<GetProductsFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    startTransition(async () => {
      const response = await getProducts(updated);
      if (response.success && response.data) {
        setProducts(response.data.products);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
        Explore Our Catalog
      </h1>

      {/* 1. Control Hub: Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-xl shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
            value={filters.sortBy}
            onChange={(e) =>
              handleFilterChange({ sortBy: e.target.value as any })
            }
          >
            <option value="latest">Sort by: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 2. Visual Products Grid View */}
      {isPending ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 font-medium text-lg animate-pulse">
            Syncing catalog changes...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg font-medium">
            No products match your active search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const hasSale = product.salePrice !== null;
            return (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        product.images[0] ||
                        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'
                      }
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasSale && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      {hasSale ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            ${product.salePrice?.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Card Button Section */}
                <div className="p-4 pt-0">
                  {product.stockQuantity > 0 ? (
                    <button
                      onClick={() => addItem(product, 1)}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-400 text-sm font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
