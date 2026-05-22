// src/types/index.ts
import {
  Product as PrismaProduct,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Address as PrismaAddress,
  User as PrismaUser,
} from '@prisma/client';

/**
 * 1. Product Contracts
 * Prisma pulls numbers matching Decimal(10,2) out as a complex Prisma.Decimal object.
 * We transform them into standard JavaScript numbers for easy rendering and math on the frontend.
 */
export interface Product extends Omit<PrismaProduct, 'price' | 'salePrice'> {
  price: number;
  salePrice: number | null;
}

/**
 * 2. Shopping Cart Contracts
 * Defines how an item behaves inside client-side storage or state management.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * 3. User & Address Contracts
 * Explicitly structures user profiles and their saved location details.
 */
export interface Address extends PrismaAddress {}

export interface UserProfile extends Omit<PrismaUser, 'passwordHash'> {
  addresses: Address[];
}

/**
 * 4. Order & Fulfillment Contracts
 * Used when rendering detailed order tracking profiles on customer screens
 * or population rows inside the administrative sales hub.
 */
export interface OrderItemWithProduct extends Omit<PrismaOrderItem, 'price'> {
  price: number;
  product: Product;
}

export interface CompleteOrder extends Omit<PrismaOrder, 'totalAmount'> {
  totalAmount: number;
  items: OrderItemWithProduct[];
}

/**
 * 5. Unified API Network Contracts
 * Standardizes server action and API endpoint responses so our UI can gracefully
 * catch errors, handle loading states, and read raw data payloads predictably.
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
