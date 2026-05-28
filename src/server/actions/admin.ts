// src/server/actions/admin.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { APIResponse } from '@/types';

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  category: string;
  imageUrl: string;
}

/**
 * Server Action to securely inject a new product record into PostgreSQL.
 */
export async function createProduct(input: CreateProductInput): Promise<APIResponse<{ id: string }>> {
  try {
    // Basic backend data sanitization guardrails
    if (!input.title || !input.description || !input.category) {
      return { success: false, error: 'All primary informational fields are required.' };
    }
    if (input.price <= 0 || input.stockQuantity < 0) {
      return { success: false, error: 'Invalid numeric boundaries provided for pricing or inventory stock.' };
    }

    // Insert record via Prisma Client mapper
    const newProduct = await prisma.product.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        salePrice: input.salePrice,
        stockQuantity: input.stockQuantity,
        category: input.category,
        images: [input.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'],
        isFeatured: false,
      },
    });

    // Refresh the client cache on the products catalog page instantly
    revalidatePath('/products');
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      data: { id: newProduct.id }
    };
  } catch (error) {
    console.error('Failed to create new catalog product entry:', error);
    return { success: false, error: 'Database execution failure during creation routing.' };
  }
}