/**
 * app/api/webhooks/payment/route.ts  (installed via CLI)
 *
 * POST /api/webhooks/payment
 *
 * Generic payment webhook endpoint.
 * Each payment provider has a different payload format and signature mechanism.
 * This file is intentionally minimal — extend it for your specific provider.
 *
 * Stripe example:
 *   const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
 *
 * Square example:
 *   const isValid = squareClient.webhooksHelper.isValidWebhookEventSignature(rawBody, sig, ...);
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/modules/cart/lib/supabase-client";

// Disable Next.js body parsing — webhook providers need the raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

/**
 * Map provider-specific event types to our internal order statuses.
 * Extend this map for your payment provider.
 */
const EVENT_STATUS_MAP: Record<string, string> = {
  // Stripe events
  "payment_intent.succeeded": "paid",
  "payment_intent.payment_failed": "cancelled",
  // Square events
  "payment.completed": "paid",
  "payment.failed": "cancelled",
};

export async function POST(req: NextRequest) {
  // ── Signature verification ─────────────────────────────────────────────
  // TODO: Replace with provider-specific verification.
  // Example (Stripe):
  //   const rawBody = await req.text();
  //   const sig = req.headers.get('stripe-signature') ?? '';
  //   const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  //
  // For now, we accept the payload as-is (suitable only for NoOpAdapter / testing).
  // NEVER skip signature verification in production.

  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload["type"] as string | undefined;
  const paymentIntentId = payload["payment_intent_id"] as string | undefined;

  if (!eventType || !paymentIntentId) {
    return NextResponse.json(
      { error: "Missing type or payment_intent_id" },
      { status: 400 }
    );
  }

  const newStatus = EVENT_STATUS_MAP[eventType];
  if (!newStatus) {
    // Unknown event — acknowledge without action
    return NextResponse.json({ received: true });
  }

  // ── Update order status ────────────────────────────────────────────────
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("payment_intent_id", paymentIntentId);

  if (error) {
    console.error("[webhooks/payment] update order error:", error);
    // Return 200 anyway to prevent provider from retrying
  }

  return NextResponse.json({ received: true });
}
