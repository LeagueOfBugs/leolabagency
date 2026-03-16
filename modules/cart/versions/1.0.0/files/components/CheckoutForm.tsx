"use client";

/**
 * CheckoutForm.tsx
 * Collects customer info, submits order to /api/cart/create-order.
 * Payment is handled by the configured PaymentAdapter — swap the adapter,
 * not this form.
 */

import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { Button } from "@/modules/ui-button/components/Button";
import type { CheckoutFormData, CreateOrderResponse } from "../types";

interface CheckoutFormProps {
  onCancel: () => void;
  onSuccess?: (order: CreateOrderResponse) => void;
}

interface FieldError {
  name?: string;
  email?: string;
}

export function CheckoutForm({ onCancel, onSuccess }: CheckoutFormProps) {
  const { items, totalCents, clearCart } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: FieldError = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Enter a valid email address";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/cart/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: formData, total_cents: totalCents }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Error ${res.status}`);
      }

      const order = (await res.json()) as CreateOrderResponse;
      clearCart();
      onSuccess?.(order);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <h3 className="text-sm font-semibold text-gray-900">Your details</h3>

      {/* Name */}
      <div>
        <label
          htmlFor="checkout-name"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Full name <span aria-hidden="true">*</span>
        </label>
        <input
          id="checkout-name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
          className={[
            "w-full rounded-md border px-3 py-2 text-sm outline-none",
            "focus:ring-2 focus:ring-offset-0 focus:ring-blue-500",
            errors.name ? "border-red-400" : "border-gray-300",
          ].join(" ")}
          aria-describedby={errors.name ? "checkout-name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="checkout-name-error" className="mt-1 text-xs text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="checkout-email"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Email address <span aria-hidden="true">*</span>
        </label>
        <input
          id="checkout-email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((f) => ({ ...f, email: e.target.value }))
          }
          className={[
            "w-full rounded-md border px-3 py-2 text-sm outline-none",
            "focus:ring-2 focus:ring-offset-0 focus:ring-blue-500",
            errors.email ? "border-red-400" : "border-gray-300",
          ].join(" ")}
          aria-describedby={errors.email ? "checkout-email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="checkout-email-error" className="mt-1 text-xs text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      <div>
        <label
          htmlFor="checkout-phone"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Phone <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="checkout-phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone ?? ""}
          onChange={(e) =>
            setFormData((f) => ({ ...f, phone: e.target.value }))
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
        />
      </div>

      {/* Server error */}
      {serverError && (
        <p role="alert" className="text-xs text-red-500 bg-red-50 rounded p-2">
          {serverError}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
          disabled={submitting}
        >
          Back
        </Button>
        <Button
          type="submit"
          size="sm"
          className="flex-1"
          disabled={submitting}
        >
          {submitting ? "Placing order…" : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
