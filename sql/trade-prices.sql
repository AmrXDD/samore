-- ============================================================================
-- SAMORE — TRADE PRICES (Steel + Oil price lists)
--
-- Creates the two tables behind the new "Trade Prices" admin section and the
-- live price tables on /steel-trading and /oil-trading.
--
-- Run the whole file in the Supabase SQL editor. Safe to re-run.
--
-- IMPORTANT: exactly ONE example row is seeded per section, taken from the
-- official SCO documents. Every other row is added/edited by the admin in
-- Admin → Trade Prices. Nothing else is pre-filled.
--
-- Prices are stored as TEXT on purpose — the source documents use values like
-- "1M", "300 K" and "520/510" that are not plain numbers.
-- ============================================================================

-- ── Steel price rows ───────────────────────────────────────────────────────
create table if not exists public.steel_prices (
  id          uuid primary key default gen_random_uuid(),
  table_group text not null default 'Main Prices',   -- 'Main Prices' | 'Small Quantities'
  product     text not null,                         -- e.g. Used Rails / Steel Billets
  quantity    text not null,                         -- e.g. 700,000.00  |  1M  |  300 K
  price_usd   text not null,                         -- e.g. 230.00
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists steel_prices_group_idx on public.steel_prices(table_group, sort_order);

drop trigger if exists steel_prices_updated_at on public.steel_prices;
create trigger steel_prices_updated_at before update on public.steel_prices
  for each row execute function public.set_updated_at();

-- ── Oil price rows ─────────────────────────────────────────────────────────
create table if not exists public.oil_prices (
  id         uuid primary key default gen_random_uuid(),
  product    text not null,          -- e.g. EN90 / JET FUEL
  fob_usd    text,                   -- e.g. 520/510
  cif_usd    text,                   -- e.g. 530/520
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists oil_prices_sort_idx on public.oil_prices(sort_order);

drop trigger if exists oil_prices_updated_at on public.oil_prices;
create trigger oil_prices_updated_at before update on public.oil_prices
  for each row execute function public.set_updated_at();

-- ── RLS: public can read active rows; only admins can write ────────────────
alter table public.steel_prices enable row level security;
alter table public.oil_prices   enable row level security;

drop policy if exists steel_prices_public_read on public.steel_prices;
create policy steel_prices_public_read on public.steel_prices
  for select using (is_active or public.is_admin());
drop policy if exists steel_prices_admin_write on public.steel_prices;
create policy steel_prices_admin_write on public.steel_prices
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists oil_prices_public_read on public.oil_prices;
create policy oil_prices_public_read on public.oil_prices
  for select using (is_active or public.is_admin());
drop policy if exists oil_prices_admin_write on public.oil_prices;
create policy oil_prices_admin_write on public.oil_prices
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Realtime ───────────────────────────────────────────────────────────────
do $$ begin
  alter publication supabase_realtime add table public.steel_prices;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.oil_prices;
exception when duplicate_object then null; end $$;

-- ============================================================================
-- SEED — ONE example row per section only. The admin adds the rest.
-- ============================================================================
insert into public.steel_prices (table_group, product, quantity, price_usd, sort_order, is_active)
select 'Main Prices', 'Used Rails', '700,000.00', '230.00', 1, true
where not exists (select 1 from public.steel_prices);

insert into public.oil_prices (product, fob_usd, cif_usd, sort_order, is_active)
select 'EN90', '520/510', '530/520', 1, true
where not exists (select 1 from public.oil_prices);

-- Refresh the API schema cache so the new tables are visible immediately.
notify pgrst, 'reload schema';

-- ── Verify ─────────────────────────────────────────────────────────────────
select 'steel_prices' as t, count(*) from public.steel_prices
union all
select 'oil_prices', count(*) from public.oil_prices;
