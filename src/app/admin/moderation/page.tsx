// src/app/admin/moderation/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import ModerationMetrics from '@/components/admin/ModerationMetrics';
import ModerationTable from '@/components/admin/ModerationTable';

export const dynamic = 'force-dynamic';

// Define the baseline text strings to target for review filtration
const SPAM_BLACKLIST_KEYWORDS = [
  'buy cheap',
  'viagra',
  'scam',
  'fake',
  'promo',
  'http://',
  'https://',
];

export default async function AdminModerationDashboard() {
  // Pull comprehensive system telemetry metrics alongside deep relationship logs
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Review Moderation Console
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor incoming customer evaluations, analyze rating breakdowns, and
          manage automated content flags.
        </p>
      </div>

      {/* Layer 1: Data Visualization Charts Block (Combined!) */}
      <ModerationMetrics
        reviews={reviews}
        flaggedKeywords={SPAM_BLACKLIST_KEYWORDS}
      />

      {/* Layer 2: Interactive Data Management Grid Matrix (Combined!) */}
      <ModerationTable
        initialReviews={reviews}
        flaggedKeywords={SPAM_BLACKLIST_KEYWORDS}
      />
    </div>
  );
}
