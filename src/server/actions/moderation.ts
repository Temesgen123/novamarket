// src/server/actions/moderation.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Administrative action to purge a review from the system
 */
export async function deleteCustomerReview(reviewId: string) {
  try {
    // 1. Gain identity clearance
    const session = await auth();
    
    // 2. Strict Role Gatekeeper check
    if (!session || session.user?.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Access restricted to System Administrators.' };
    }

    // 3. Execute targeted atomic delete operation
    const deletedReview = await prisma.review.delete({
      where: { id: reviewId },
    });

    // 4. Invalidate product details route caches dynamically
    revalidatePath(`/products/${deletedReview.productId}`);
    revalidatePath('/admin/moderation');
    
    return { success: true };
    
  } catch (error) {
    console.error('Failed to purge review record from Postgres:', error);
    return { success: false, error: 'Internal pipeline mutation error.' };
  }
}