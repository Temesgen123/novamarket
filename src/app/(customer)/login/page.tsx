// src/app/(customer)/login/page.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Grab the callbackUrl (falls back to dashboard if missing)
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const handleMockAdminLogin = () => {
    // Inject mock admin cookie keys matching our middleware.ts enforcement criteria
    document.cookie = "novamarket_session=mock_production_jwt_token; path=/; max-age=3600; SameSite=Strict";
    document.cookie = "novamarket_role=ADMIN; path=/; max-age=3600; SameSite=Strict";

    // Refresh and route right back into your protected dashboard deck
    router.push(callbackUrl);
    router.refresh();
  };

  const handleMockCustomerLogin = () => {
    // Inject user role without admin rights to test restricted states
    document.cookie = "novamarket_session=mock_customer_jwt_token; path=/; max-age=3600; SameSite=Strict";
    document.cookie = "novamarket_role=CUSTOMER; path=/; max-age=3600; SameSite=Strict";

    router.push('/products');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">NovaMarket Gatekeeper</h1>
          <p className="text-xs text-gray-400 mt-1">Select a mock session identity profile to test live middleware routing boundaries.</p>
        </div>

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
      </div>
    </main>
  );
}