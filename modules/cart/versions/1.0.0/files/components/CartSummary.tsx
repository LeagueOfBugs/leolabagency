"use client";

/**
 * CartSummary.tsx
 * Shows subtotal and a "Proceed to Checkout" action.
 * Rendered in the CartDrawer footer. Can also be embedded on a dedicated cart page.
 */

import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { Button } from "@/modules/ui-button/components/Button";
import { CheckoutForm } from "./CheckoutForm";

export function CartSummary() {
  const { formattedTotal, totalItems, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return (
      <CheckoutForm onCancel={() => setShowCheckout(false)} />
    );
  }

  return (
    <div className="space-y-4">
      {/* Totals */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
        <span className="font-semibold text-gray-900">{formattedTotal}</span>
      </div>

      <p className="text-xs text-gray-400">
        Shipping and taxes calculated at checkout.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={() => setShowCheckout(true)}
        >
          Proceed to Checkout
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-500"
          onClick={clearCart}
        >
          Clear cart
        </Button>
      </div>
    </div>
  );
}
