// src/components/admin/ModerationTable.tsx
'use client';

import React, { useTransition, useState } from 'react';
import { deleteCustomerReview } from '@/server/actions/moderation';

interface ReviewRow {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  product: { title: string };
  user: { name: string | null; email: string };
}

interface Props {
  initialReviews: ReviewRow[];
  flaggedKeywords: string[];
}

export default function ModerationTable({
  initialReviews,
  flaggedKeywords,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState('');

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you absolutely certain you want to purge this record?'))
      return;
    setError('');

    startTransition(async () => {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      const result = await deleteCustomerReview(reviewId);
      if (!result.success) {
        setError(result.error || 'Failed to execute task.');
        setReviews(initialReviews);
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-600 rounded-xl shadow-sm animate-shake">
          {error}
        </div>
      )}

      <div className="overflow-hidden bg-white border border-slate-200/80 rounded-2xl shadow-md shadow-slate-100/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="p-4">Customer Account</th>
              <th className="p-4">Target Product</th>
              <th className="p-4">Score Metric</th>
              <th className="p-4">Comment Transcript</th>
              <th className="p-4 text-right">System Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-slate-400 font-light italic"
                >
                  Clear records ledger. No platform logs found.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => {
                const isViolatingRules = flaggedKeywords.some((word) =>
                  rev.comment.toLowerCase().includes(word.toLowerCase()),
                );

                return (
                  <tr
                    key={rev.id}
                    className={`transition-all duration-150 ${isViolatingRules ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-semibold text-slate-900">
                            {rev.user.name || 'Anonymous User'}
                          </span>
                          <span className="block text-xs text-slate-400 font-mono mt-0.5">
                            {rev.user.email}
                          </span>
                        </div>
                        {isViolatingRules && (
                          <span className="px-2 py-0.5 bg-rose-100 border border-rose-200 text-rose-700 text-[9px] font-black rounded-md uppercase tracking-wider animate-pulse">
                            Flagged Risk
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800 truncate max-w-[160px]">
                      {rev.product.title}
                    </td>
                    <td className="p-4">
                      <span className="text-amber-400 drop-shadow-sm font-bold tracking-tight">
                        {'★'.repeat(rev.rating)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 max-w-md text-xs text-slate-600 leading-relaxed font-light break-words">
                      "{rev.comment}"
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(rev.id)}
                        disabled={isPending}
                        className="px-4 py-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 disabled:bg-slate-50 disabled:text-slate-300 text-xs font-semibold rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
                      >
                        Purge Record
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
