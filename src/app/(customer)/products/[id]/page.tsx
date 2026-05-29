// src/app/(customer)/products/[id]/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import Image from 'next/image'; // <-- 1. Import Next.js optimized image framework
import ProductReviewsConsole from '@/components/products/ProductReviewsConsole';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!product) notFound();

  // 2. Identify if a valid target URL is loaded in the Postgres table array
  const hasLiveImage =
    product.images && product.images.length > 0 && product.images[0];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <nav className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <a
            href="/products"
            className="hover:text-slate-900 transition-colors"
          >
            Catalog
          </a>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          {/* Left Column Profile: Dynamic Media Framework Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-video w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/40 relative overflow-hidden group flex items-center justify-center">
              {hasLiveImage ? (
                // Render the real live item file when available
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-w-7xl) 60vw, 100vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              ) : (
                // Luxury fallback canvas if the database asset link is empty
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent)]" />
                  <span className="text-[32px] mb-2 opacity-80">📦</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
                    No Media File Indexed
                  </span>
                </div>
              )}
            </div>

            {/* Structural details grid underneath */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Classification
                </span>
                <span className="block text-xs font-semibold text-slate-800 mt-1 truncate">
                  {product.category || 'Premium'}
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Availability
                </span>
                <span className="block text-xs font-semibold text-slate-800 mt-1">
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} Units`
                    : 'OOS'}
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Origin
                </span>
                <span className="block text-xs font-semibold text-slate-800 mt-1">
                  Authentic Tier
                </span>
              </div>
            </div>
          </div>

          {/* Right Column Profile: Clean Sticky Purchase Controls */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-100/80 space-y-6">
              <div>
                <span className="inline-block px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-black tracking-widest uppercase rounded-md mb-3">
                  Verified Dispatch Ready
                </span>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  {product.title}
                </h1>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    USD
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Product Intelligence
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              <div className="pt-4">
                <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all duration-150 active:translate-y-0 hover:-translate-y-0.5 cursor-pointer">
                  Acquire Instantly
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 border-t border-slate-200/60 pt-5 max-w-4xl mx-auto">
          <ProductReviewsConsole
            productId={product.id}
            initialReviews={product.reviews}
            currentUserName={session?.user?.name || null}
          />
        </div>
      </main>
    </div>
  );
}
