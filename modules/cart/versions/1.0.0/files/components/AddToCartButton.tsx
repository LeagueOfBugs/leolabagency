"use client";

/**
 * AddToCartButton.tsx
 * Drop-in CTA button that adds a product to the cart and opens the drawer.
 *
 * Usage:
 *   <AddToCartButton product={product} />
 *   <AddToCartButton product={product} quantity={2} variant="outline" />
 */

import React, { useState, useTransition } from "react";
import { useCart } from "../hooks/useCart";
// ui-button module (installed as a peer dependency by the CLI)
import { Button, type ButtonProps } from "@/modules/ui-button/components/Button";
import type { Product } from "../types";

interface AddToCartButtonProps
  extends Pick<ButtonProps, "variant" | "size" | "className"> {
  product: Product;
  quantity?: number;
  /** Text to show when stock is exhausted */
  outOfStockLabel?: string;
  /** Milliseconds to show "Added!" feedback */
  feedbackDuration?: number;
}

export function AddToCartButton({
  product,
  quantity = 1,
  outOfStockLabel = "Out of Stock",
  feedbackDuration = 1500,
  ...buttonProps
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const [, startTransition] = useTransition();

  const isOutOfStock =
    product.inventory !== null && product.inventory <= 0;

  const handleAdd = () => {
    addItem(product, quantity);
    openCart();
    setAdded(true);
    startTransition(() => {
      setTimeout(() => setAdded(false), feedbackDuration);
    });
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={isOutOfStock || added}
      aria-label={
        isOutOfStock
          ? outOfStockLabel
          : added
            ? "Added to cart"
            : `Add ${product.name} to cart`
      }
      {...buttonProps}
    >
      {isOutOfStock ? outOfStockLabel : added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
