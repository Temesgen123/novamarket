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

export default function ProductReviewsConsole({
  productId,
  initialReviews,
  currentUserName,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    initialReviews,
    (state, newReview: ReviewDisplayType) => [newReview, ...state],
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!comment.trim()) return;

    const tempReviewPayload: ReviewDisplayType = {
      id: crypto.randomUUID(),
      rating,
      comment: comment.trim(),
      createdAt: new Date(),
      user: { name: currentUserName || 'Verified Buyer' },
    };

    startTransition(async () => {
      addOptimisticReview(tempReviewPayload);
      setComment('');

      const result = await createProductReview({
        productId,
        rating,
        comment: tempReviewPayload.comment,
      });

      if (!result.success) {
        setError(result.error || 'Failed to sync review with database.');
      }
    });
  };

  return (
    <div className="mt-24 max-w-4xl border-t border-slate-100 pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Guest Appraisals
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Genuine feedback gathered from verified platform checkout tiers.
          </p>
        </div>
      </div>

      {currentUserName ? (
        <form
          onSubmit={handleSubmitReview}
          className="mb-12 bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5 space-y-5"
        >
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Share Your Experience
          </h3>

          {error && (
            <p className="text-sm font-medium text-rose-600 bg-rose-50/60 px-4 py-3 rounded-xl border border-rose-100">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200/80 w-fit shadow-sm">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-xl transition-all duration-150 ${star <= rating ? 'text-amber-400 scale-110 drop-shadow-sm' : 'text-slate-200 hover:text-slate-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think about the product material, design, sizing, or delivery speed?"
              required
              rows={4}
              className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 resize-none transition-all duration-200"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-black disabled:bg-slate-300 text-white font-medium rounded-xl text-xs uppercase tracking-widest shadow-sm cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isPending ? 'Publishing Record...' : 'Publish Instantly'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-5 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex items-center justify-between text-sm text-amber-900 shadow-sm">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>
              You must be{' '}
              <a
                href="/login"
                className="underline font-semibold hover:text-amber-900"
              >
                authenticated
              </a>{' '}
              to submit product feedback.
            </span>
          </div>
        </div>
      )}

      {/* Elegant Review Feed Feed */}
      <div className="space-y-4">
        {optimisticReviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-400 italic">
              No reviews yet. Be the first to express your thoughts.
            </p>
          </div>
        ) : (
          optimisticReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md/50 hover:border-slate-200/60 transition-all duration-200 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-sm font-semibold text-slate-800">
                    {rev.user?.name || 'Verified Customer'}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex text-amber-400 drop-shadow-sm tracking-tighter">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
