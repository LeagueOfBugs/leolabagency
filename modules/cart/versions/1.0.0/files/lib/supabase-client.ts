/**
 * supabase-client.ts
 *
 * Browser-safe Supabase client (anon key) and a server-only service client.
 * The browser client is a singleton — safe to import anywhere.
 * The service client must only be used in Next.js API routes / Server Actions.
 */

import { createClient } from "@supabase/supabase-js";

// ─── Type helpers ─────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price_cents: number;
          slug: string;
          inventory: number | null;
          active: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["products"]["Insert"]
        >;
      };
      orders: {
        Row: {
          id: string;
          status: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          shipping_address: Record<string, unknown> | null;
          total_cents: number;
          payment_provider: string;
          payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["orders"]["Insert"]
        >;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_cents: number;
          product_name: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["order_items"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["order_items"]["Insert"]
        >;
      };
    };
  };
}

// ─── Browser client (singleton) ──────────────────────────────────────────

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!_client) {
    _client = createClient<Database>(getSupabaseUrl(), getAnonKey());
  }
  return _client;
}

/** Convenience export for direct use */
export const supabase = getSupabaseClient;

// ─── Server-only service client ───────────────────────────────────────────

/**
 * Returns a Supabase client authenticated with the service role key.
 * NEVER expose this client to the browser.
 * Call only inside Next.js route handlers or Server Actions.
 */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(getSupabaseUrl(), serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
