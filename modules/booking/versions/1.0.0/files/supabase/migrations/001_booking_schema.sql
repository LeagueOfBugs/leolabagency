-- ============================================================
-- LeoLabAgency Booking Module — Supabase migration
-- Run: paste into Supabase SQL editor and click Run
-- ============================================================

-- ─── appointments ─────────────────────────────────────────────────────────
create table if not exists public.appointments (
  id               uuid        primary key default gen_random_uuid(),
  status           text        not null default 'pending'
                     check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  customer_name    text        not null,
  customer_phone   text        not null,
  customer_email   text,
  service          text        not null,
  preferred_date   date        not null,
  preferred_time   text        not null,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at (reuse function if already created by cart module)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- Useful indexes
create index if not exists appointments_status_idx        on public.appointments (status);
create index if not exists appointments_preferred_date_idx on public.appointments (preferred_date);
create index if not exists appointments_customer_phone_idx on public.appointments (customer_phone);

-- ─── Row Level Security ───────────────────────────────────────────────────
-- All reads and writes go through the service role API route.
-- No direct client access to appointments.

alter table public.appointments enable row level security;
-- (No public policies — service role bypasses RLS automatically)
