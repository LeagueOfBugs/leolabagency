/**
 * payment-adapter.ts
 *
 * Adapter pattern that keeps the cart module payment-provider-agnostic.
 *
 * Usage:
 *   // In a client-specific setup file (e.g. app/providers.tsx):
 *   import { setPaymentAdapter } from '@/modules/cart/lib/payment-adapter';
 *   import { StripePaymentAdapter } from '@/lib/adapters/stripe-adapter';
 *   setPaymentAdapter(new StripePaymentAdapter());
 *
 * Supported adapters (implement PaymentAdapter):
 *   - NoOpPaymentAdapter   — default; always succeeds, no external call
 *   - StripePaymentAdapter — add per-client in /lib/adapters/
 *   - SquarePaymentAdapter — add per-client in /lib/adapters/
 */

import type { CartItem, CheckoutFormData, PaymentResult } from "../types";

// ─── Interface ──────────────────────────────────────────────────────────────

export interface PaymentAdapterParams {
  items: CartItem[];
  customer: CheckoutFormData;
  /** Total amount in cents */
  totalCents: number;
}

export interface PaymentAdapter {
  /** Human-readable provider name (e.g. "stripe", "square", "noop") */
  readonly name: string;
  processPayment(params: PaymentAdapterParams): Promise<PaymentResult>;
}

// ─── No-op adapter (default) ─────────────────────────────────────────────

/**
 * NoOpPaymentAdapter
 * Always returns success without any external API call.
 * Use during development or when payment processing is handled elsewhere.
 */
export class NoOpPaymentAdapter implements PaymentAdapter {
  readonly name = "noop";

  async processPayment(_params: PaymentAdapterParams): Promise<PaymentResult> {
    return {
      success: true,
      paymentIntentId: `noop_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };
  }
}

// ─── Global adapter registry ─────────────────────────────────────────────

let _activeAdapter: PaymentAdapter = new NoOpPaymentAdapter();

/** Replace the global payment adapter */
export function setPaymentAdapter(adapter: PaymentAdapter): void {
  _activeAdapter = adapter;
}

/** Get the currently active payment adapter */
export function getPaymentAdapter(): PaymentAdapter {
  return _activeAdapter;
}
