// src/server/actions/reviews.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { APIResponse } from '@/types';

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

export async function createProductReview(input: CreateReviewInput): Promise<APIResponse<any>> {
  try {
    // 1. Enforce active identity clearance checks
    const session = await auth();
    if (!session || !session.user?.id) {
      return { success: false, error: 'You must be authenticated to leave a product review.' };
    }

    // 2. Bound data sanitization rules
    if (input.rating < 1 || input.rating > 5 || !input.comment.trim()) {
      return { success: false, error: 'Invalid ratings score or missing review commentary text.' };
    }

    // 3. Commit data write to PostgreSQL engine
    await prisma.review.create({
      data: {
        rating: input.rating,
        comment: input.comment,
        productId: input.productId,
        userId: session.user.id,
      },
    });

    // Purge cached item detail routes to sync fresh metrics
    revalidatePath(`/products/${input.productId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Failed to register customer review:', error);
    return { success: false, error: 'Database pipeline mutation crash.' };
  }
}