// src/app/products/[id]/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import ProductReviewsConsole from '@/components/products/ProductReviewsConsole';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  // Pull item data along with its associated reviews and reviewer names
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      }
    }
  });

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* ... keeping your core beautiful product display images, titles, and cart button layouts exactly as they are ... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>{/* Product details and purchase mechanics */}</div>
      </div>

      {/* Append the interactive reviews section below the fold */}
      <ProductReviewsConsole 
        productId={product.id}
        initialReviews={product.reviews}
        currentUserName={session?.user?.name || null}
      />
    </main>
  );
}