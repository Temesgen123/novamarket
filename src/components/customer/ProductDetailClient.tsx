// src/components/customer/ProductDetailClient.tsx
'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const hasSale = product.salePrice !== null;
  const currentPrice = hasSale ? product.salePrice! : product.price;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleQuantityChange = (amount: number) => {
    const nextQty = quantity + amount;
    if (nextQty >= 1 && nextQty <= product.stockQuantity) {
      setQuantity(nextQty);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Left Column: Image Stack */}
        <div className="flex flex-col">
          <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                product.images[activeImageIndex] ||
                'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'
              }
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnail Gallery (Only renders if there are multiple images) */}
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 cursor-pointer transition-all ${
                    idx === activeImageIndex
                      ? 'border-blue-600 scale-95 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Copywriting details and checkout controls */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0 flex flex-col justify-between h-full">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.title}
            </h1>

            {/* Pricing Node */}
            <div className="mt-4 flex items-baseline gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 w-fit">
              {hasSale ? (
                <>
                  <span className="text-3xl font-black text-red-600">
                    ${product.salePrice?.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-md uppercase">
                    Save ${(product.price - product.salePrice!).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Inventory Status badge */}
            <div className="mt-6 flex items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  isOutOfStock
                    ? 'bg-red-100 text-red-800'
                    : product.stockQuantity < 5
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : product.stockQuantity < 5
                    ? `Only ${product.stockQuantity} items left in stock!`
                    : 'In Stock & Ready to Ship'}
              </span>
            </div>

            {/* Description Body */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Product Information
              </h3>
              <p className="mt-3 text-base text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Checkout Control Pod */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            {!isOutOfStock ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Quantity Toggler */}
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden h-12">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-bold transition-colors h-full disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-lg"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 text-gray-900 font-bold text-center min-w-[50px] select-none text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-bold transition-colors h-full disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Submit Action Button */}
                <button
                  onClick={() => addItem(product, quantity)}
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer h-12 flex items-center justify-center"
                >
                  Add to Cart • ${(currentPrice * quantity).toFixed(2)}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 font-bold py-3.5 px-8 rounded-xl cursor-not-allowed text-base text-center border border-gray-200"
              >
                Item Backordered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
