// src/components/customer/MiniCart.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function MiniCart() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Calculate total item count across all unique products
  const totalItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Lock body scrolling when the cart slider drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Header Cart Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {totalItemCount > 0 && (
          <span className="bg-blue-600 text-white text-xs font-black h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center animate-fade-in">
            {totalItemCount}
          </span>
        )}
      </button>

      {/* Dark Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 backdrop-blur-sm"
        />
      )}

      {/* Slide-Out Slider Panel Container */}
      <div
        className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalItemCount} items ready for checkout
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-xl font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 font-medium">
                Your shopping cart is completely empty
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Continue Browsing Products
              </button>
            </div>
          ) : (
            items.map((item) => {
              const activePrice = item.product.salePrice ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="flex py-4 gap-4 first:pt-0 last:pb-0 group"
                >
                  {/* Product Thumbnail image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Meta descriptions copy */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-gray-800">
                        <h4 className="line-clamp-1 pr-2">
                          {item.product.title}
                        </h4>
                        <p className="text-gray-900 ml-auto">
                          ${(activePrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 uppercase tracking-wider">
                        {item.product.category}
                      </p>
                    </div>

                    {/* Interactive state modifiers */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-inner h-8">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 font-bold transition-colors h-full cursor-pointer text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800 text-center min-w-[24px] select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 font-bold transition-colors h-full cursor-pointer text-sm"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rolling Total Footer Pod */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between text-base font-bold text-gray-900 mb-2">
              <span>Subtotal</span>
              <span className="text-xl font-black">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Shipping fees and local commerce taxes computed at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-center py-3.5 px-6 rounded-xl transition-colors shadow-md block text-sm tracking-wide cursor-pointer"
            >
              Proceed to Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
