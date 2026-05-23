// src/server/actions/product.ts
'use server';

import { prisma } from '@/lib/prisma';
import { APIResponse, Product } from '@/types';

// Strict interface defining the search, filter, and pagination parameters
export interface GetProductsFilters {
  search?: string;
  category?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'latest';
  page?: number;
  limit?: number;
}

// Structuring a standardized response payload for paginated components
export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetches products from PostgreSQL based on runtime filter metrics.
 * Safe to call directly within Next.js Server Components.
 */
export async function getProducts(
  filters: GetProductsFilters = {},
): Promise<APIResponse<PaginatedProducts>> {
  try {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = (page - 1) * limit;

    // 1. Build dynamic query clauses based on user interactions
    const whereClause: any = {};

    if (filters.category && filters.category !== 'All') {
      whereClause.category = filters.category;
    }

    if (filters.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // 2. Map frontend sorting options to database order rules
    let orderByClause: any = { createdAt: 'desc' }; // default layout
    if (filters.sortBy === 'price_asc') {
      orderByClause = { price: 'asc' };
    } else if (filters.sortBy === 'price_desc') {
      orderByClause = { price: 'desc' };
    }

    // 3. Execute data operations concurrently to minimize load latency
    const [rawProducts, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip: skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // 4. Transform Prisma Decimals into regular standard numbers for frontend consumption
    const formattedProducts: Product[] = rawProducts.map((p) => ({
      ...p,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
    }));

    return {
      success: true,
      data: {
        products: formattedProducts,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Database query failure inside getProducts action:', error);
    return {
      success: false,
      error: 'Failed to synchronize with product catalog data.',
    };
  }
}

/**
 * Fetches a single unique product profile by its ID.
 */
export async function getProductById(
  id: string,
): Promise<APIResponse<Product>> {
  try {
    const rawProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!rawProduct) {
      return { success: false, error: 'Requested item does not exist.' };
    }

    const formattedProduct: Product = {
      ...rawProduct,
      price: Number(rawProduct.price),
      salePrice: rawProduct.salePrice ? Number(rawProduct.salePrice) : null,
    };

    return {
      success: true,
      data: formattedProduct,
    };
  } catch (error) {
    console.error(`Database failure searching product ID: ${id}`, error);
    return {
      success: false,
      error: 'Failed to download product item attributes.',
    };
  }
}
