"use client";

/**
 * CartItem.tsx
 * Renders a single line item in the cart drawer.
 */

import React from "react";
import { useCart } from "../hooks/useCart";
import type { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const unitFormatted = formatCents(item.price_cents);
  const lineFormatted = formatCents(item.price_cents * item.quantity);

  return (
    <div className="flex items-start gap-3 py-4">
      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item.productName}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{unitFormatted} each</p>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-1.5" role="group" aria-label={`Quantity for ${item.productName}`}>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base leading-none"
          aria-label={`Decrease quantity of ${item.productName}`}
        >
          −
        </button>
        <span
          className="w-6 text-center text-sm font-medium tabular-nums"
          aria-live="polite"
        >
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base leading-none"
          aria-label={`Increase quantity of ${item.productName}`}
        >
          +
        </button>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-semibold tabular-nums">
          {lineFormatted}
        </span>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Remove ${item.productName} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
