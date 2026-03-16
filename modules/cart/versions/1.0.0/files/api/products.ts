/**
 * app/api/cart/products/route.ts  (installed via CLI)
 *
 * GET /api/cart/products
 * Returns all active products. Uses the anon key — safe for public reads.
 * RLS policy on the products table restricts to active=true rows.
 */

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/modules/cart/lib/supabase-client";

export async function GET() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price_cents, slug, inventory, active, metadata")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("[/api/cart/products] Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  return NextResponse.json({ products: data });
}
