-- ============================================================
-- LeoLabAgency Cart Module — Supabase migration 001
-- Run: supabase db push  OR  paste into Supabase SQL editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── products ─────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  -- Price stored in integer cents. NEVER store as float.
  price_cents   integer     not null check (price_cents >= 0),
  slug          text        not null unique,
  -- null = unlimited inventory
  inventory     integer     check (inventory >= 0),
  active        boolean     not null default true,
  metadata      jsonb       not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column public.products.price_cents is
  'Unit price in US cents (integer). $19.99 = 1999.';

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ─── orders ───────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  status              text        not null default 'pending'
                        check (status in (
                          'pending', 'processing', 'paid',
                          'shipped', 'delivered', 'cancelled', 'refunded'
                        )),
  customer_name       text        not null,
  customer_email      text        not null,
  customer_phone      text,
  shipping_address    jsonb,
  -- Order total in integer cents
  total_cents         integer     not null check (total_cents >= 0),
  payment_provider    text        not null default 'noop',
  payment_intent_id   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on column public.orders.total_cents is
  'Order total in US cents (integer). $19.99 = 1999.';

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index if not exists orders_customer_email_idx on public.orders (customer_email);
create index if not exists orders_payment_intent_id_idx on public.orders (payment_intent_id);
create index if not exists orders_status_idx on public.orders (status);

-- ─── order_items ──────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id                uuid    primary key default gen_random_uuid(),
  order_id          uuid    not null references public.orders (id) on delete cascade,
  product_id        uuid    not null references public.products (id) on delete restrict,
  quantity          integer not null check (quantity > 0),
  -- Price snapshotted at order time — do NOT reference products.price_cents
  unit_price_cents  integer not null check (unit_price_cents >= 0),
  -- Name snapshotted at order time
  product_name      text    not null
);

comment on column public.order_items.unit_price_cents is
  'Unit price at time of purchase (integer cents). Immutable after insert.';

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);

-- ─── Row Level Security ───────────────────────────────────────────────────

-- Products: public read for active rows; writes via service role only
alter table public.products enable row level security;

drop policy if exists "Products: public read active" on public.products;
create policy "Products: public read active"
  on public.products for select
  using (active = true);

-- Orders: no direct client access; all reads/writes via service role API routes
alter table public.orders enable row level security;

-- Order items: no direct client access
alter table public.order_items enable row level security;

-- ─── Seed data (optional — remove in production) ──────────────────────────

-- Example products for local development
insert into public.products (name, price_cents, slug, inventory, active, metadata)
values
  ('Example T-Shirt',   2999, 'example-t-shirt',   100, true, '{"color": "black", "sizes": ["S","M","L","XL"]}'),
  ('Example Hoodie',    5999, 'example-hoodie',      50, true, '{"color": "navy",  "sizes": ["S","M","L","XL"]}'),
  ('Example Sticker',    499, 'example-sticker',   null, true, '{}')
on conflict (slug) do nothing;
