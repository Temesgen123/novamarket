// src/components/customer/CheckoutClient.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function CheckoutClient() {
  const { items, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Address Capture States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Fire parameters to our secure Stripe payment engine endpoint
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gateway interaction exception');
      }

      // 2. Capture clientSecret and simulate a successful payment processing event
      console.log('Stripe Sandbox ClientSecret Generated:', data.clientSecret);

      // Trigger successful local view state transformations
      setOrderPlaced(true);
      clearCart();
    } catch (error: any) {
      console.error('Payment failure routing event:', error);
      alert(`Payment Gateway Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State Splash Layout
  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto my-16 text-center px-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-sm">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 text-green-600 font-bold text-xl">
            ✓
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Order Placed Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Thank you for shopping at NovaMarket. Your mock order payload has
            been captured and routed to our database pipelines.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty State Boundary Guard
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 text-center px-4">
        <h2 className="text-2xl font-black text-gray-900">
          Your checkout cart is empty
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          Add items from the store catalog before initializing checkout steps.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
        {/* Left Aspect: Shipping Form Interface Panel */}
        <form
          onSubmit={handleSubmitCheckout}
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 bg-white"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center text-sm cursor-pointer"
          >
            {isSubmitting
              ? 'Authorizing Secure Escrow Gateway...'
              : `Authorize Order Placement • $${getCartTotal().toFixed(2)}`}
          </button>
        </form>

        {/* Right Aspect: Running Order Inventory Summaries */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Order Summary
            </h2>

            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto mb-4 pr-1">
              {items.map((item) => {
                const activePrice =
                  item.product.salePrice ?? item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex py-3 items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 line-clamp-1 max-w-[180px]">
                          {item.product.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${(activePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-900">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-green-600 font-bold uppercase text-xs bg-green-100 px-1.5 py-0.5 rounded">
                  Free
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-black text-gray-900">
                <span>Total Due</span>
                <span className="text-xl">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
