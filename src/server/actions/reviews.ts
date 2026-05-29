/// src/server/actions/reviews.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

export async function createProductReview(input: CreateReviewInput) {
  try {
    // 1. Authenticate the active user session
    const session = await auth();
    if (!session || !session.user?.id) {
      return { success: false, error: 'You must be logged in to write a review.' };
    }

    // 2. Validate input constraints
    if (input.rating < 1 || input.rating > 5 || !input.comment.trim()) {
      return { success: false, error: 'Invalid rating score or empty review comment.' };
    }

    // 3. Write data to your PostgreSQL cluster
    await prisma.review.create({
      data: {
        rating: input.rating,
        comment: input.comment.trim(),
        productId: input.productId,
        userId: session.user.id,
      },
    });

    // Clear Next.js data caches so the static page updates instantly
    revalidatePath(`/products/${input.productId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Database write error during review submission:', error);
    return { success: false, error: 'Failed to save review to the database.' };
  }
}