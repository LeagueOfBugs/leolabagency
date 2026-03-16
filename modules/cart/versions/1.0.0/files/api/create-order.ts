/**
 * app/api/cart/create-order/route.ts  (installed via CLI)
 *
 * POST /api/cart/create-order
 * Body: CreateOrderPayload
 *
 * Flow:
 *  1. Validate request body
 *  2. Re-fetch prices from DB to prevent client-side price tampering
 *  3. Run payment via configured PaymentAdapter
 *  4. Insert order + order_items into Supabase (service role)
 *  5. Return orderId + status
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/modules/cart/lib/supabase-client";
import { getPaymentAdapter } from "@/modules/cart/lib/payment-adapter";
import type { CreateOrderPayload, CartItem } from "@/modules/cart/types";

export async function POST(req: NextRequest) {
  let body: CreateOrderPayload;

  try {
    body = (await req.json()) as CreateOrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Basic validation ───────────────────────────────────────────────────
  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!body.customer?.name || !body.customer?.email) {
    return NextResponse.json(
      { error: "customer.name and customer.email are required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // ── Re-fetch product prices to prevent tampering ───────────────────────
  const productIds = body.items.map((i) => i.productId);
  const { data: products, error: fetchErr } = await supabase
    .from("products")
    .select("id, price_cents, name, inventory, active")
    .in("id", productIds);

  if (fetchErr || !products) {
    console.error("[create-order] fetch products error:", fetchErr);
    return NextResponse.json(
      { error: "Failed to validate products" },
      { status: 500 }
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Validate each item and build verified items list
  const verifiedItems: CartItem[] = [];
  for (const item of body.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${item.productId}` },
        { status: 400 }
      );
    }
    if (!product.active) {
      return NextResponse.json(
        { error: `Product is no longer available: ${product.name}` },
        { status: 400 }
      );
    }
    if (product.inventory !== null && product.inventory < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for: ${product.name}` },
        { status: 400 }
      );
    }
    verifiedItems.push({
      ...item,
      price_cents: product.price_cents, // use DB price, not client price
      productName: product.name,
    });
  }

  // Recalculate total server-side
  const totalCents = verifiedItems.reduce(
    (sum, i) => sum + i.price_cents * i.quantity,
    0
  );

  // ── Process payment ────────────────────────────────────────────────────
  const adapter = getPaymentAdapter();
  let paymentResult;
  try {
    paymentResult = await adapter.processPayment({
      items: verifiedItems,
      customer: body.customer,
      totalCents,
    });
  } catch (err) {
    console.error("[create-order] payment error:", err);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 502 }
    );
  }

  if (!paymentResult.success) {
    return NextResponse.json(
      { error: paymentResult.error ?? "Payment declined" },
      { status: 402 }
    );
  }

  // ── Insert order ───────────────────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      status: "paid",
      customer_name: body.customer.name,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone ?? null,
      shipping_address: (body.customer.address ?? null) as Record<string, unknown> | null,
      total_cents: totalCents,
      payment_provider: adapter.name,
      payment_intent_id: paymentResult.paymentIntentId ?? null,
    })
    .select("id, status")
    .single();

  if (orderErr || !order) {
    console.error("[create-order] insert order error:", orderErr);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }

  // ── Insert order items ─────────────────────────────────────────────────
  const { error: itemsErr } = await supabase.from("order_items").insert(
    verifiedItems.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      quantity: i.quantity,
      unit_price_cents: i.price_cents,
      product_name: i.productName,
    }))
  );

  if (itemsErr) {
    console.error("[create-order] insert order_items error:", itemsErr);
    // Order exists but items failed — log for manual recovery
  }

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    paymentIntentId: paymentResult.paymentIntentId,
  });
}
