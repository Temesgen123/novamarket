// src/components/products/ProductReviewsConsole.tsx
'use client';

import React, { useState, useOptimistic, useTransition } from 'react';
import { createProductReview } from '@/server/actions/reviews';

interface ReviewDisplayType {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: { name: string | null };
}

interface Props {
  productId: string;
  initialReviews: ReviewDisplayType[];
  currentUserName: string | null;
}

export default function ProductReviewsConsole({ productId, initialReviews, currentUserName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // 1. Unpack the Optimistic UI state layer
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    initialReviews,
    (state, newReview: ReviewDisplayType) => [newReview, ...state] // Unshift the new comment instantly into view
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!comment.trim()) return;

    const simulatedId = crypto.randomUUID();
    const newReviewPayload = {
      id: simulatedId,
      rating,
      comment: comment.trim(),
      createdAt: new Date(),
      user: { name: currentUserName || 'Verified Buyer' },
    };

    // 2. Instantly append review into state before server contact
    startTransition(async () => {
      addOptimisticReview(newReviewPayload);
      setComment('');

      const result = await createProductReview({
        productId,
        rating,
        comment: newReviewPayload.comment,
      });

      if (!result.success) {
        setError(result.error || 'Failed to sync review data.');
      }
    });
  };

  return (
    <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Customer Interactions</h2>

      {/* Write Console Form */}
      {currentUserName ? (
        <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Leave a Verified Review</h3>
          
          {error && <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>}
          
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Score Matrix:</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-bold"
            >
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your item sizing, material reviews, and performance metrics..."
            required
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-colors"
          >
            {isPending ? 'Syncing...' : 'Publish Instantly'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 font-medium">
          🔒 Please sign in to authenticate your purchase footprint and leave a product review.
        </div>
      )}

      {/* Render Review Feeds */}
      <div className="space-y-4">
        {optimisticReviews.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No buyer insights cataloged for this inventory index yet.</p>
        ) : (
          optimisticReviews.map((rev) => (
            <div key={rev.id} className="p-4 border border-gray-100 rounded-xl bg-white space-y-1 transition-opacity">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">{rev.user?.name || 'Anonymous User'}</span>
                <span className="text-xs text-amber-500 font-black">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
              <span className="block text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}