"use client";

/**
 * CartProvider.tsx
 * Wrap your app layout with this component.
 * Renders children + the CartDrawer portal.
 *
 * Usage (app/layout.tsx):
 *   import { CartProvider } from '@/modules/cart/components/CartProvider';
 *   export default function RootLayout({ children }) {
 *     return <html><body><CartProvider>{children}</CartProvider></body></html>;
 *   }
 */

import React from "react";
import { CartDrawer } from "./CartDrawer";

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
