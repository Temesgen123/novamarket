// src/components/admin/ModerationMetrics.tsx
'use client';

import React from 'react';

interface ReviewData {
  rating: number;
  comment: string;
}

interface Props {
  reviews: ReviewData[];
  flaggedKeywords: string[];
}

export default function ModerationMetrics({ reviews, flaggedKeywords }: Props) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const flaggedCount = reviews.filter((r) =>
    flaggedKeywords.some((word) =>
      r.comment.toLowerCase().includes(word.toLowerCase()),
    ),
  ).length;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews
      ? Math.round((count / totalReviews) * 100)
      : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Metric 1: Premium Dark Slate Accent Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-slate-800 font-bold text-9xl pointer-events-none opacity-20 select-none group-hover:scale-110 transition-transform duration-300">
          ★
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Feedback Velocity
        </span>
        <h3 className="text-5xl font-extrabold tracking-tight mt-3">
          {totalReviews}
        </h3>
        <p className="text-xs text-slate-400 mt-6 border-t border-slate-800 pt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" />
          Live database sync active
        </p>
      </div>

      {/* Metric 2: Premium Safety Warning Card */}
      <div className="p-6 bg-white border border-slate-200/70 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Risk Interceptions
          </span>
          <h3
            className={`text-5xl font-extrabold tracking-tight mt-3 ${flaggedCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}
          >
            {flaggedCount}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-6 border-t border-slate-100 pt-3 font-medium">
          {flaggedCount > 0
            ? '⚠️ Profanity or spam string detected.'
            : '🛡️ All records pass baseline safety checks.'}
        </p>
      </div>

      {/* Metric 3: Elegant Distribution Array Card */}
      <div className="p-6 bg-white border border-slate-200/70 rounded-2xl shadow-md">
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Rating Balance
          </span>
          <span className="text-sm font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
            {averageRating} ★ Score
          </span>
        </div>
        <div className="space-y-2.5">
          {distribution.map((dist) => (
            <div
              key={dist.stars}
              className="flex items-center text-xs font-medium text-slate-600 gap-3"
            >
              <span className="w-4 text-right text-slate-400 font-bold">
                {dist.stars}★
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-slate-400 font-semibold">
                {dist.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
