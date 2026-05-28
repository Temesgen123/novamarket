// src/app/(customer)/login/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Inner Form Component that consumes runtime search parameters safely.
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Grab the callbackUrl (falls back to dashboard if missing)
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const handleMockAdminLogin = () => {
    document.cookie = "novamarket_session=mock_production_jwt_token; path=/; max-age=3600; SameSite=Strict";
    document.cookie = "novamarket_role=ADMIN; path=/; max-age=3600; SameSite=Strict";

    router.push(callbackUrl);
    router.refresh();
  };

  const handleMockCustomerLogin = () => {
    document.cookie = "novamarket_session=mock_customer_jwt_token; path=/; max-age=3600; SameSite=Strict";
    document.cookie = "novamarket_role=CUSTOMER; path=/; max-age=3600; SameSite=Strict";

    router.push('/products');
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleMockAdminLogin}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm text-sm cursor-pointer"
      >
        Bypass Edge: Inject ADMIN Session Token
      </button>

      <button
        onClick={handleMockCustomerLogin}
        className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm cursor-pointer"
      >
        Test Restriction: Inject CUSTOMER Token
      </button>
    </div>
  );
}

/**
 * Main Page Export containing the structural static Suspense Boundary
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">NovaMarket Gatekeeper</h1>
          <p className="text-xs text-gray-400 mt-1">Select a mock session identity profile to test live middleware routing boundaries.</p>
        </div>

        {/* Wrap search-param component inside Suspense boundary fallback frame */}
        <Suspense fallback={
          <div className="text-center py-4 text-sm font-medium text-gray-400 animate-pulse">
            Loading authorization interfaces...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}