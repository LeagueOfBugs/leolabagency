/**
 * supabase-client.ts (booking module)
 * Self-contained Supabase client — does not depend on other modules.
 */

import { createClient } from "@supabase/supabase-js";

export type BookingDatabase = {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          status: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          service: string;
          preferred_date: string;
          preferred_time: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          service: string;
          preferred_date: string;
          preferred_time: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          service?: string;
          preferred_date?: string;
          preferred_time?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
}

/** Server-only client with service role — use in API routes only */
export function createBookingServiceClient() {
  return createClient<BookingDatabase>(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
