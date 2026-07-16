-- ============================================================================
-- SAMORE — Seed content + bank details
--
-- Run this in the Supabase SQL editor AFTER sql/schema.sql.
-- Safe to re-run (idempotent guards throughout). It will also UPGRADE an
-- older database created before the cart feature existed.
--
-- Contains:
--   1. Schema upgrade  : courses.code column + payment_items table
--   2. Course catalogue: all 22 SAMORE courses, EXACTLY 1:1 with the official
--                        "Engineering Courses" document (code / name / days /
--                        hours / USD price). Titles are verbatim.
--   3. Bank details    : QNB Bank - Turkey, USD account (per the bank sheet)
-- ============================================================================


-- ────────────────────────────────────────────────────────────────
-- 1. Schema upgrade (no-ops on a fresh schema.sql install)
-- ────────────────────────────────────────────────────────────────
alter table public.courses add column if not exists code text;

create table if not exists public.payment_items (
  id         uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  course_id  uuid references public.courses(id) on delete set null,
  title      text not null,
  code       text,
  price      numeric(12,2) not null default 0 check (price >= 0),
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);
create index if not exists payment_items_payment_idx on public.payment_items(payment_id);
create index if not exists payment_items_course_idx on public.payment_items(course_id);

alter table public.payment_items enable row level security;
drop policy if exists payment_items_admin_all on public.payment_items;
create policy payment_items_admin_all on public.payment_items
  for all using (public.is_admin()) with check (public.is_admin());


-- ────────────────────────────────────────────────────────────────
-- 2. Course categories + the 22 courses (1:1 with the source document)
-- ────────────────────────────────────────────────────────────────
insert into public.course_categories (name, slug) values
  ('Planning', 'planning'),
  ('Claims', 'claims'),
  ('Contracts', 'contracts'),
  ('Value Engineering', 'value-engineering'),
  ('Project Control', 'project-control'),
  ('Arbitration', 'arbitration'),
  ('General', 'general')
on conflict (name) do nothing;

insert into public.courses
  (code, title, slug, description, price, currency, duration, instructor, category_id, visibility)
select
  v.code, v.title, v.slug, v.description, v.price, 'USD',
  '5 Days / 20 Hours', 'SAMORE Faculty', c.id, 'published'
from (values
  ('P01', 'Planning by Primavera P6 Level 01', 'p01-planning-by-primavera-p6-level-01',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'Planning'),
  ('P02', 'Planning by Primavera P6 Level 02', 'p02-planning-by-primavera-p6-level-02',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'Planning'),
  ('P03', 'Planning by Primavera P6 Level 03 - Use Primavera for Project control system & Payment issue', 'p03-planning-by-primavera-p6-level-03',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 1000, 'Planning'),
  ('C01', 'Construction Claims Basics Level 01', 'c01-construction-claims-basics-level-01',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'Claims'),
  ('C02', 'Construction Claims Level 02', 'c02-construction-claims-level-02',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 1000, 'Claims'),
  ('C03', 'Claim Guarding during the construction project', 'c03-claim-guarding-during-the-construction-project',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 1000, 'Claims'),
  ('C04', 'Construction Claim Disputes Level 03', 'c04-construction-claim-disputes-level-03',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 1000, 'Claims'),
  ('PCS', 'Project Control Systems Engineer', 'pcs-project-control-systems-engineer',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 750, 'Project Control'),
  ('FDC', 'FIDIC Contract', 'fdc-fidic-contract',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'Contracts'),
  ('BOT', 'BOT Contracts', 'bot-bot-contracts',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'Contracts'),
  ('MNT', 'Maintenance Contracts', 'mnt-maintenance-contracts',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'Contracts'),
  ('CE1', 'Contract administrator Engineer Level 01', 'ce1-contract-administrator-engineer-level-01',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'Contracts'),
  ('CE2', 'Contract administrator Engineer Level 02', 'ce2-contract-administrator-engineer-level-02',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 1000, 'Contracts'),
  ('VE1', 'Value Engineering', 've1-value-engineering',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 1500, 'Value Engineering'),
  ('VE2', 'Use Value Engineering to minimize project cost', 've2-use-value-engineering-to-minimize-project-cost',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 2500, 'Value Engineering'),
  ('ARB', 'Engineering Arbitration', 'arb-engineering-arbitration',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'Arbitration'),
  ('PPR', 'Construction Project Progress Reports', 'ppr-construction-project-progress-reports',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'General'),
  ('MET', 'Construction site meetings Function & Tanique', 'met-construction-site-meetings-function-tanique',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'General'),
  ('PCO', 'Project''s professional Close out procedures', 'pco-projects-professional-close-out-procedures',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'General'),
  ('ISP', 'Infra structure projects', 'isp-infra-structure-projects',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'General'),
  ('CMP', 'Crises Management in the delayed Projects', 'cmp-crises-management-in-the-delayed-projects',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 500, 'General'),
  ('GRR', 'New Methods of Garbage Recycling worldwide', 'grr-new-methods-of-garbage-recycling-worldwide',
   'Professional course for Engineers, Engineering Students, Master and PHD. 5 days / 20 hours.', 300, 'General')
) as v(code, title, slug, description, price, cat)
left join public.course_categories c on c.name = v.cat
on conflict (slug) do update
  set code        = excluded.code,
      title       = excluded.title,
      price       = excluded.price,
      currency    = excluded.currency,
      duration    = excluded.duration,
      category_id = excluded.category_id,
      visibility  = 'published';


-- ────────────────────────────────────────────────────────────────
-- 3. Bank transfer details — QNB Bank, Turkey (USD account)
--    Source: official SAMORE bank sheet. USD IBAN is the account in use.
-- ────────────────────────────────────────────────────────────────
insert into public.bank_settings (
  id, bank_name, account_name, account_number, iban, swift, branch,
  currency, is_active, instructions, updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  'QNB Bank - Turkey',
  'SAMEH IBRAHIM ELSAYED MOHAMED MOUSTAFA',
  '158510319',
  'TR390011100000000158510319',
  'FNNBTRISOPS',
  'ORTAKOY',
  'USD',
  true,
  E'Account type: Demand Deposit (USD).\nBranch address: MECIDIYE MAH. DEREBOYU CAD. NO: 39, Ortakoy, Istanbul, Turkey.\nBranch telephone: +90 212 227 06 26.\n\nPlease quote your payment reference on the transfer and upload the receipt after payment. All bank charges are on the sender.'
)
on conflict (id) do update
  set bank_name      = excluded.bank_name,
      account_name   = excluded.account_name,
      account_number = excluded.account_number,
      iban           = excluded.iban,
      swift          = excluded.swift,
      branch         = excluded.branch,
      currency       = excluded.currency,
      is_active      = true,
      instructions   = excluded.instructions,
      updated_at     = now();


-- ────────────────────────────────────────────────────────────────
-- 4. Homepage hero singleton (harmless if already present)
-- ────────────────────────────────────────────────────────────────
insert into public.hero (id, eyebrow, headline, subheadline, cta_label, cta_href)
values (
  '00000000-0000-0000-0000-000000000001',
  'Engineering services and Steel & Oil Trading',
  'Engineering excellence. Steel & oil, sourced direct.',
  'At SAMORE we stand at the crossroads of innovation and tradition — a partner in success across construction technical support, conflict resolution, value engineering, engineering education, and steel & oil trading.',
  'Explore services', '/engineering-construction'
) on conflict (id) do nothing;
