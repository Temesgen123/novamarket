// src/app/(customer)/login/page.tsx
"use client"; // <-- CRITICAL: Must be line 1 to tell Turbopack this entire module runs on the client

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

/**
 * Inner Form Component utilizing live Auth.js provider handshakes
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dynamic callback capture setup
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const handleSecureLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Execute the real NextAuth configuration router validation scheme
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Handle routing actions manually to capture validation errors elegantly
      });

      if (result?.error) {
        setError('Invalid administrative profile email or password mismatch configuration.');
      } else {
        // Drop them right into their requested operational path
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected database authentication exception was encountered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSecureLogin} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Identity Email</label>
        <input
          type="email"
          name="email"
          required
          defaultValue="admin@novamarket.com"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="admin@novamarket.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Secret Access Key</label>
        <input
          type="password"
          name="password"
          required
          defaultValue="secure_password_string"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm text-sm cursor-pointer mt-2"
      >
        {loading ? 'Verifying Identity Credentials...' : 'Authenticate Secure Access'}
      </button>
    </form>
  );
}

/**
 * Main Layout Export containing the compulsory Static Pre-render Suspense Envelope
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">NovaMarket Gatekeeper</h1>
          <p className="text-xs text-gray-400 mt-1">Provide secure administrator database profiles to pass Edge routing guards.</p>
        </div>

        {/* Binds Client-Side Bailouts cleanly to pass static generation validation passes */}
        <Suspense fallback={
          <div className="text-center py-4 text-sm font-medium text-gray-400 animate-pulse">
            Constructing encrypted authorization components...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}