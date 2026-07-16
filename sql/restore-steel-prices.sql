-- ============================================================================
-- SAMORE — RESTORE STEEL PRICES
-- Run in the Supabase SQL editor. Safe to re-run (won't duplicate).
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- OPTION A — restore just the single example row (the original seed).
-- Use this if you only lost the seeded row and will type the rest yourself.
-- ─────────────────────────────────────────────────────────────────────────
insert into public.steel_prices (table_group, product, quantity, price_usd, sort_order, is_active)
select 'Main Prices', 'Used Rails', '700,000.00', '230.00', 1, true
where not exists (
  select 1 from public.steel_prices
  where product = 'Used Rails' and quantity = '700,000.00'
);


-- ─────────────────────────────────────────────────────────────────────────
-- OPTION B — restore the FULL steel price list from the official SCO
-- document (260501-SCO-SAMORE-STEEL). Only run this if you had typed the
-- whole list in and lost it.
--
-- To use: select everything between the BEGIN/END markers below, uncomment
-- it (Ctrl+/ in the SQL editor), and run.
-- ─────────────────────────────────────────────────────────────────────────
/* ---------------- BEGIN FULL LIST ----------------
insert into public.steel_prices (table_group, product, quantity, price_usd, sort_order, is_active)
select * from (values
  -- Used Rails
  ('Main Prices','Used Rails','700,000.00','230.00',1,true),
  ('Main Prices','Used Rails','900,000.00','225.00',2,true),
  ('Main Prices','Used Rails','1M','210.00',3,true),
  ('Main Prices','Used Rails','2M','205.00',4,true),
  ('Main Prices','Used Rails','3M','200.00',5,true),
  ('Main Prices','Used Rails','5M','195.00',6,true),
  -- Steel Billets
  ('Main Prices','Steel Billets','300,000.00','520.00',10,true),
  ('Main Prices','Steel Billets','400,000.00','515.00',11,true),
  ('Main Prices','Steel Billets','500,000.00','440.00',12,true),
  ('Main Prices','Steel Billets','700,000.00','435.00',13,true),
  ('Main Prices','Steel Billets','1M','355.00',14,true),
  -- Steel Bars
  ('Main Prices','Steel Bars','300,000.00','545.00',20,true),
  ('Main Prices','Steel Bars','400,000.00','540.00',21,true),
  ('Main Prices','Steel Bars','500,000.00','465.00',22,true),
  ('Main Prices','Steel Bars','700,000.00','460.00',23,true),
  ('Main Prices','Steel Bars','1M','380.00',24,true),
  -- Hot Rolled Coil
  ('Main Prices','Hot Rolled Coil','300,000.00','680.00',30,true),
  ('Main Prices','Hot Rolled Coil','400,000.00','675.00',31,true),
  ('Main Prices','Hot Rolled Coil','500,000.00','625.00',32,true),
  ('Main Prices','Hot Rolled Coil','700,000.00','620.00',33,true),
  ('Main Prices','Hot Rolled Coil','1M','515.00',34,true),
  -- Cold Rolled Coil
  ('Main Prices','Cold Rolled Coil','300,000.00','705.00',40,true),
  ('Main Prices','Cold Rolled Coil','400,000.00','700.00',41,true),
  ('Main Prices','Cold Rolled Coil','500,000.00','650.00',42,true),
  ('Main Prices','Cold Rolled Coil','700,000.00','645.00',43,true),
  ('Main Prices','Cold Rolled Coil','1M','570.00',44,true),
  -- Galvanized Rolled Coil
  ('Main Prices','Galvanized Rolled Coil','300,000.00','785.00',50,true),
  ('Main Prices','Galvanized Rolled Coil','400,000.00','780.00',51,true),
  ('Main Prices','Galvanized Rolled Coil','500,000.00','705.00',52,true),
  ('Main Prices','Galvanized Rolled Coil','700,000.00','700.00',53,true),
  ('Main Prices','Galvanized Rolled Coil','1M','620.00',54,true),
  -- Exceptional prices for Small Quantities — Used Rail
  ('Small Quantities','Used Rail','300 K','280.00',60,true),
  ('Small Quantities','Used Rail','400 K','270.00',61,true),
  ('Small Quantities','Used Rail','500 K','250.00',62,true),
  ('Small Quantities','Used Rail','600 K','240.00',63,true),
  -- Small Quantities — Re-Bar
  ('Small Quantities','Re-Bar','100 K','595.00',70,true),
  ('Small Quantities','Re-Bar','150 K','595.00',71,true),
  ('Small Quantities','Re-Bar','200 K','570.00',72,true),
  ('Small Quantities','Re-Bar','250 K','565.00',73,true),
  -- Small Quantities — Billet
  ('Small Quantities','Billet','100 K','560.00',80,true),
  ('Small Quantities','Billet','150 K','555.00',81,true),
  ('Small Quantities','Billet','200 K','530.00',82,true),
  ('Small Quantities','Billet','250 K','525.00',83,true)
) as v(table_group, product, quantity, price_usd, sort_order, is_active)
where not exists (
  select 1 from public.steel_prices s
  where s.product = v.product and s.quantity = v.quantity
);
------------------ END FULL LIST ---------------- */

-- Verify
select table_group, product, quantity, price_usd
from public.steel_prices
order by sort_order;
