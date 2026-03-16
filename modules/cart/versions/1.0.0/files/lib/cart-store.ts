"use client";

/**
 * cart-store.ts
 * Zustand store with localStorage persistence.
 * Import via the useCart hook — do not access this directly in components.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Mutations
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Drawer control
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed (as functions to keep Zustand simple)
  totalItems: () => number;
  totalCents: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                productName: product.name,
                price_cents: product.price_cents,
                quantity,
                slug: product.slug,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalCents: () =>
        get().items.reduce(
          (sum, i) => sum + i.price_cents * i.quantity,
          0
        ),
    }),
    {
      name: "leolabagency-cart",
      // Only persist items; drawer state resets on page load
      partialize: (state) => ({ items: state.items }),
    }
  )
);
