-- ============================================================================
-- SAMORE — Complete database schema (Supabase / PostgreSQL)
-- Single-file, idempotent-ish migration: tables, constraints, indexes,
-- foreign keys, views, functions, triggers, RLS, storage, realtime and seed.
--
-- Apply with:  supabase db reset      (local)
--          or  psql "$DATABASE_URL" -f sql/schema.sql
--          or  paste into the Supabase SQL editor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid(), crypt()
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.visibility as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'submitted', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contact_status as enum ('new', 'read', 'archived');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Utility: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text not null,
  full_name            text,
  role                 public.user_role not null default 'user',
  must_change_password boolean not null default false,
  created_at           timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);

-- ---------------------------------------------------------------------------
-- admins  (explicit allow-list; mirrors profiles with role='admin')
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER helper avoids RLS recursion when checking admin status.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- New-user handler: create a profile row automatically
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'user')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- services  (fixed company hierarchy — seeded, read-mostly)
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  division        text not null,
  parent_slug     text,
  summary         text,
  seo_title       text,
  seo_description text,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists services_division_idx on public.services(division);
create index if not exists services_parent_idx on public.services(parent_slug);

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- course_categories
-- ---------------------------------------------------------------------------
create table if not exists public.course_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  description   text,
  price         numeric(12,2) not null default 0 check (price >= 0),
  currency      char(3) not null default 'USD',
  thumbnail_url text,
  duration      text,
  instructor    text,
  category_id   uuid references public.course_categories(id) on delete set null,
  visibility    public.visibility not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists courses_visibility_idx on public.courses(visibility);
create index if not exists courses_category_idx on public.courses(category_id);
create index if not exists courses_created_idx on public.courses(created_at desc);

drop trigger if exists courses_updated_at on public.courses;
create trigger courses_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- course_registrations
-- ---------------------------------------------------------------------------
create table if not exists public.course_registrations (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid references public.courses(id) on delete set null,
  customer_name text not null,
  email         text not null,
  phone         text,
  company       text,
  status        public.payment_status not null default 'pending',
  created_at    timestamptz not null default now()
);
create index if not exists registrations_email_idx on public.course_registrations(email);
create index if not exists registrations_course_idx on public.course_registrations(course_id);

-- ---------------------------------------------------------------------------
-- loi (Letters of Intent)
-- ---------------------------------------------------------------------------
create table if not exists public.loi (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  payment_id    uuid,
  customer_name text not null,
  company       text,
  email         text not null,
  phone         text,
  subject       text not null,
  quantity      text,
  amount        numeric(14,2),
  currency      char(3) not null default 'USD',
  pdf_url       text,
  pdf_path      text,
  created_at    timestamptz not null default now()
);
create index if not exists loi_email_idx on public.loi(email);
create index if not exists loi_created_idx on public.loi(created_at desc);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,
  course_id       uuid references public.courses(id) on delete set null,
  registration_id uuid references public.course_registrations(id) on delete set null,
  customer_name   text not null,
  email           text not null,
  phone           text,
  company         text,
  amount          numeric(12,2) not null default 0 check (amount >= 0),
  currency        char(3) not null default 'USD',
  method          text not null default 'bank_transfer' check (method = 'bank_transfer'),
  status          public.payment_status not null default 'pending',
  loi_id          uuid references public.loi(id) on delete set null,
  receipt_url     text,
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_email_idx on public.payments(email);
create index if not exists payments_created_idx on public.payments(created_at desc);

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- Late FK: loi.payment_id -> payments.id
do $$ begin
  alter table public.loi
    add constraint loi_payment_fk
    foreign key (payment_id) references public.payments(id) on delete set null;
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- payment_receipts
-- ---------------------------------------------------------------------------
create table if not exists public.payment_receipts (
  id          uuid primary key default gen_random_uuid(),
  payment_id  uuid not null references public.payments(id) on delete cascade,
  file_url    text not null,
  file_path   text not null,
  uploaded_at timestamptz not null default now()
);
create index if not exists receipts_payment_idx on public.payment_receipts(payment_id);

-- ---------------------------------------------------------------------------
-- bank_settings (singleton)
-- ---------------------------------------------------------------------------
create table if not exists public.bank_settings (
  id             uuid primary key default gen_random_uuid(),
  bank_name      text,
  account_name   text,
  account_number text,
  iban           text,
  swift          text,
  branch         text,
  currency       char(3) not null default 'USD',
  instructions   text,
  is_active      boolean not null default true,
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  company      text,
  phone        text,
  email        text not null,
  message      text not null,
  inquiry_type text not null default 'General Inquiry',
  status       public.contact_status not null default 'new',
  created_at   timestamptz not null default now()
);
create index if not exists contact_status_idx on public.contact_messages(status);
create index if not exists contact_created_idx on public.contact_messages(created_at desc);

-- ---------------------------------------------------------------------------
-- newsletter
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- activity_logs
-- ---------------------------------------------------------------------------
create table if not exists public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  actor      text,
  action     text not null,
  entity     text,
  entity_id  uuid,
  meta       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_created_idx on public.activity_logs(created_at desc);

-- ---------------------------------------------------------------------------
-- settings (key/value), seo, hero, media
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.seo (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique,
  title      text,
  description text,
  og_image   text,
  updated_at timestamptz not null default now()
);

create table if not exists public.hero (
  id          uuid primary key default gen_random_uuid(),
  eyebrow     text,
  headline    text not null,
  subheadline text,
  cta_label   text,
  cta_href    text,
  updated_at  timestamptz not null default now()
);

create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  bucket     text not null,
  path       text not null,
  url        text not null,
  kind       text,
  alt        text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------------
create or replace view public.admin_recent_orders as
  select p.id, p.reference, p.customer_name, p.email, p.amount, p.currency,
         p.status, p.created_at, c.title as course_title
  from public.payments p
  left join public.courses c on c.id = p.course_id
  order by p.created_at desc;

-- ---------------------------------------------------------------------------
-- RPC: dashboard_stats() -> json
-- ---------------------------------------------------------------------------
create or replace function public.dashboard_stats()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'total_sales',      coalesce((select sum(amount) from public.payments where status = 'approved'), 0),
    'total_courses',    (select count(*) from public.courses),
    'total_emails',     (select count(*) from public.newsletter),
    'total_loi',        (select count(*) from public.loi),
    'pending_payments', (select count(*) from public.payments where status in ('pending','submitted')),
    'approved_payments',(select count(*) from public.payments where status = 'approved'),
    'total_customers',  (select count(distinct email) from public.payments),
    'total_messages',   (select count(*) from public.contact_messages)
  );
$$;

-- ---------------------------------------------------------------------------
-- RPC: monthly_revenue() -> last 12 months
-- ---------------------------------------------------------------------------
create or replace function public.monthly_revenue()
returns table(month text, revenue numeric, orders bigint)
language sql
security definer
set search_path = public
stable
as $$
  with months as (
    select generate_series(
      date_trunc('month', now()) - interval '11 months',
      date_trunc('month', now()),
      interval '1 month'
    ) as m
  )
  select
    to_char(months.m, 'Mon') as month,
    coalesce(sum(p.amount) filter (where p.status = 'approved'), 0) as revenue,
    count(p.id) filter (where p.status = 'approved') as orders
  from months
  left join public.payments p
    on date_trunc('month', p.created_at) = months.m
  group by months.m
  order by months.m;
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles            enable row level security;
alter table public.admins              enable row level security;
alter table public.services            enable row level security;
alter table public.course_categories   enable row level security;
alter table public.courses             enable row level security;
alter table public.course_registrations enable row level security;
alter table public.payments            enable row level security;
alter table public.payment_receipts    enable row level security;
alter table public.bank_settings       enable row level security;
alter table public.contact_messages    enable row level security;
alter table public.newsletter          enable row level security;
alter table public.loi                 enable row level security;
alter table public.activity_logs       enable row level security;
alter table public.settings            enable row level security;
alter table public.seo                 enable row level security;
alter table public.hero                enable row level security;
alter table public.media               enable row level security;

-- profiles: self access; admins read all
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- admins: admin-only
drop policy if exists admins_admin_all on public.admins;
create policy admins_admin_all on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

-- Public-readable content (published only) + admin full access.
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
  for select using (is_published or public.is_admin());
drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists categories_public_read on public.course_categories;
create policy categories_public_read on public.course_categories
  for select using (true);
drop policy if exists categories_admin_write on public.course_categories;
create policy categories_admin_write on public.course_categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists courses_public_read on public.courses;
create policy courses_public_read on public.courses
  for select using (visibility = 'published' or public.is_admin());
drop policy if exists courses_admin_write on public.courses;
create policy courses_admin_write on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists hero_public_read on public.hero;
create policy hero_public_read on public.hero for select using (true);
drop policy if exists hero_admin_write on public.hero;
create policy hero_admin_write on public.hero
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists bank_public_read on public.bank_settings;
create policy bank_public_read on public.bank_settings
  for select using (is_active or public.is_admin());
drop policy if exists bank_admin_write on public.bank_settings;
create policy bank_admin_write on public.bank_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists seo_public_read on public.seo;
create policy seo_public_read on public.seo for select using (true);
drop policy if exists seo_admin_write on public.seo;
create policy seo_admin_write on public.seo
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists settings_admin_all on public.settings;
create policy settings_admin_all on public.settings
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists settings_public_read on public.settings;
create policy settings_public_read on public.settings for select using (true);

-- Public may submit forms (anon insert), admins manage.
drop policy if exists contact_public_insert on public.contact_messages;
create policy contact_public_insert on public.contact_messages
  for insert with check (true);
drop policy if exists contact_admin_all on public.contact_messages;
create policy contact_admin_all on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists newsletter_public_insert on public.newsletter;
create policy newsletter_public_insert on public.newsletter
  for insert with check (true);
drop policy if exists newsletter_admin_all on public.newsletter;
create policy newsletter_admin_all on public.newsletter
  for all using (public.is_admin()) with check (public.is_admin());

-- Registrations / payments / receipts / loi: admin-only (server uses service role).
drop policy if exists registrations_admin_all on public.course_registrations;
create policy registrations_admin_all on public.course_registrations
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists payments_admin_all on public.payments;
create policy payments_admin_all on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists receipts_admin_all on public.payment_receipts;
create policy receipts_admin_all on public.payment_receipts
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists loi_admin_all on public.loi;
create policy loi_admin_all on public.loi
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists activity_admin_all on public.activity_logs;
create policy activity_admin_all on public.activity_logs
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists media_public_read on public.media;
create policy media_public_read on public.media for select using (true);
drop policy if exists media_admin_write on public.media;
create policy media_admin_write on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- Storage buckets + policies
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('course-thumbnails', 'course-thumbnails', true),
  ('media',             'media',             true),
  ('logos',             'logos',             true),
  ('receipts',          'receipts',          false),
  ('loi',               'loi',               false)
on conflict (id) do nothing;

-- Public buckets: anyone can read; admins write.
drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects
  for select using (bucket_id in ('course-thumbnails', 'media', 'logos'));

drop policy if exists storage_admin_write on storage.objects;
create policy storage_admin_write on storage.objects
  for all using (
    bucket_id in ('course-thumbnails', 'media', 'logos', 'receipts', 'loi')
    and public.is_admin()
  ) with check (
    bucket_id in ('course-thumbnails', 'media', 'logos', 'receipts', 'loi')
    and public.is_admin()
  );
-- Note: private buckets (receipts, loi) are read via signed URLs generated by
-- the service role in server actions — no public read policy is granted.

-- ============================================================================
-- Realtime
-- ============================================================================
do $$ begin
  alter publication supabase_realtime add table public.payments;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.contact_messages;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.course_registrations;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.activity_logs;
exception when duplicate_object then null; end $$;

-- ============================================================================
-- Seed data
-- ============================================================================

-- Singleton bank settings + hero
insert into public.bank_settings (id, currency, is_active, instructions)
values (
  '00000000-0000-0000-0000-000000000001',
  'USD', true,
  'Bank account details will be provided. Please quote your payment reference on the transfer.'
)
on conflict (id) do nothing;

insert into public.hero (id, eyebrow, headline, subheadline, cta_label, cta_href)
values (
  '00000000-0000-0000-0000-000000000001',
  'Engineering services and Steel & Oil Trading',
  'Engineering excellence. Steel & oil, sourced direct.',
  'At SAMORE we stand at the crossroads of innovation and tradition — a partner in success across construction technical support, conflict resolution, value engineering, engineering education, and steel & oil trading.',
  'Explore services',
  '/engineering-construction'
)
on conflict (id) do nothing;

-- Company settings
insert into public.settings (key, value)
values (
  'company',
  jsonb_build_object(
    'name', 'SAMORE',
    'legalName', 'SAMORE Engineering Construction Agriculture Industry and Trade Limited Company',
    'email', 'SAMORE2021@gmail.com',
    'phone', '+965-66259917',
    'address', '',
    'logoUrl', ''
  )
)
on conflict (key) do nothing;

-- Services (exact SAMORE hierarchy)
insert into public.services (slug, title, division, parent_slug, sort_order) values
  ('engineering-construction',        'Engineering & Construction',      'engineering-construction', null, 1),
  ('project-technical-support',       'Project Technical Support',       'engineering-construction', 'engineering-construction', 2),
  ('project-planning',                'Project Planning',                'engineering-construction', 'project-technical-support', 3),
  ('project-control-systems',         'Project Control Systems',         'engineering-construction', 'project-technical-support', 4),
  ('value-engineering',               'Value Engineering',               'engineering-construction', 'project-technical-support', 5),
  ('construction-conflict-solutions', 'Construction Conflict Solutions', 'engineering-construction', 'engineering-construction', 6),
  ('project-claims',                  'Project Claims',                  'engineering-construction', 'construction-conflict-solutions', 7),
  ('court-expert-engineer',           'Court Expert Engineer',           'engineering-construction', 'construction-conflict-solutions', 8),
  ('project-claim-guarding',          'Project Claim Guarding',          'engineering-construction', 'construction-conflict-solutions', 9),
  ('engineering-education',           'Engineering Education',           'engineering-construction', 'engineering-construction', 10),
  ('engineering-courses',             'Engineering Courses',             'engineering-construction', 'engineering-education', 11),
  ('on-job-assist',                   'On Job Assist',                   'engineering-construction', 'engineering-education', 12),
  ('steel-oil-trading',               'Steel & Oil Trading',             'steel-oil-trading',        null, 13),
  ('steel-trading',                   'Steel Trading',                   'steel-oil-trading',        'steel-oil-trading', 14),
  ('oil-trading',                     'Oil Trading',                     'steel-oil-trading',        'steel-oil-trading', 15)
on conflict (slug) do nothing;

-- Course categories
insert into public.course_categories (name, slug) values
  ('Planning', 'planning'),
  ('Claims', 'claims'),
  ('Contracts', 'contracts'),
  ('Value Engineering', 'value-engineering'),
  ('Project Control', 'project-control'),
  ('Arbitration', 'arbitration'),
  ('General', 'general')
on conflict (name) do nothing;

-- ============================================================================
-- Seed admin user
--   email:    admin@samore.com
--   password: ChangeMe123!  (must be changed on first login)
-- ============================================================================
do $$
declare
  admin_id uuid := '11111111-1111-1111-1111-111111111111';
begin
  if not exists (select 1 from auth.users where email = 'admin@samore.com') then
    insert into auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'admin@samore.com',
      crypt('ChangeMe123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"SAMORE Administrator","role":"admin"}'::jsonb,
      now(), now()
    );

    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(),
      admin_id,
      admin_id,
      jsonb_build_object('sub', admin_id::text, 'email', 'admin@samore.com', 'email_verified', true),
      'email',
      now(), now(), now()
    );
  end if;

  -- Ensure profile is admin + force password change on first login.
  insert into public.profiles (id, email, full_name, role, must_change_password)
  values (admin_id, 'admin@samore.com', 'SAMORE Administrator', 'admin', true)
  on conflict (id) do update
    set role = 'admin', must_change_password = true, full_name = 'SAMORE Administrator';

  insert into public.admins (user_id) values (admin_id)
  on conflict (user_id) do nothing;
end $$;

-- ============================================================================
-- Grants (RPC callable by API roles; RLS still applies)
-- ============================================================================
grant execute on function public.dashboard_stats() to anon, authenticated, service_role;
grant execute on function public.monthly_revenue() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- End of schema.
