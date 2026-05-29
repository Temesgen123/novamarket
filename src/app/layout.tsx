// src/app/layout.tsx
import React from 'react';
import './globals.css';
// Import your global cart provider context wrapper
import { CartProvider } from '@/hooks/useCart';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        {/* Wrap the tree inside the CartProvider context layout */}
        <CartProvider>
          <header className="w-full bg-white border-b border-slate-200/60 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <a
                href="/"
                className="text-md font-black tracking-tighter text-slate-900 uppercase"
              >
                Nova<span className="text-slate-400">Market</span>.
              </a>
              <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold flex items-center gap-2">
                <span>🛒</span>
                <span>Bag (0)</span>
              </button>
            </div>
          </header>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}
