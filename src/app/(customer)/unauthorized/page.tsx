// src/app/(customer)/unauthorized/page.tsx
import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-center">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 text-red-600 font-bold text-2xl mb-4">
          ✕
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Access Restricted</h1>
        
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          Your account does not possess the administrative authorization credentials required to access the operational dashboard.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
          >
            Return to Store Catalog
          </Link>
          
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            Sign in with a different account
          </Link>
        </div>
      </div>
    </main>
  );
}