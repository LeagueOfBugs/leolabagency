"use client";

/**
 * useCart.ts
 * Public API for the cart module. Import this in components — do not
 * reach into cart-store directly.
 */

import { useCartStore } from "../lib/cart-store";
import type { CartItem, Product } from "../types";

export interface UseCartReturn {
  items: CartItem[];
  isOpen: boolean;

  // Mutations
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: number;
  totalCents: number;
  /** Formatted string, e.g. "$19.99" */
  formattedTotal: string;
  isEmpty: boolean;
}

export function useCart(): UseCartReturn {
  const store = useCartStore();

  const totalCents = store.totalCents();
  const totalItems = store.totalItems();

  return {
    items: store.items,
    isOpen: store.isOpen,

    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,

    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,

    totalItems,
    totalCents,
    formattedTotal: formatCents(totalCents),
    isEmpty: store.items.length === 0,
  };
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
