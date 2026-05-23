// src/hooks/useCart.ts
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartState } from '@/types';

// Create a blank Context matching our predefined structural type contract
const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Load cart items from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('novamarket_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // 2. Automatically sync state adjustments back to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('novamarket_cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  // 3. Core Cart Actions Enforced by our TypeScript Interface
  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Guard rail: check that we don't exceed available stock inventory limits
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stockQuantity) {
          alert(
            `Sorry, only ${product.stockQuantity} items are available in stock.`,
          );
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item,
        );
      }

      // Safeguard against pushing an initial selection beyond stock bounds
      if (quantity > product.stockQuantity) {
        alert(
          `Sorry, only ${product.stockQuantity} items are available in stock.`,
        );
        return prevItems;
      }

      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id !== productId) return item;

        if (quantity > item.product.stockQuantity) {
          alert(
            `Sorry, max available inventory is ${item.product.stockQuantity}.`,
          );
          return item;
        }
        return { ...item, quantity };
      }),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      // Use salePrice if it exists, otherwise fall back to regular base price
      const activePrice = item.product.salePrice ?? item.product.price;
      return total + activePrice * item.quantity;
    }, 0);
  };

  return React.createElement(
    CartContext.Provider,
    {
      value: {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
      },
    },
    children,
  );
}

// 4. Custom Hook allowing any consumer layout to easily query our states
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      'useCart must be wrapped and called within a global <CartProvider /> context layout.',
    );
  }
  return context;
}
