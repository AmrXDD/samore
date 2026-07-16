-- ============================================================================
-- SAMORE — Promote an existing Supabase user to admin
--
-- Use this AFTER creating the user in the Supabase dashboard:
--   Authentication → Users → Add user → tick "Auto Confirm User"
--
-- Creating the user through the dashboard guarantees the auth row is valid
-- (raw SQL inserts into auth.users are fragile across Supabase versions).
-- This script only grants that user admin rights inside the app.
-- ============================================================================

-- Change this if you use a different address:
-- (the value appears twice below)

insert into public.profiles (id, email, full_name, role, must_change_password)
select u.id, u.email, 'SAMORE Administrator', 'admin', false
from auth.users u
where u.email = 'freeeng21cen@gmail.com'
on conflict (id) do update
  set role = 'admin',
      must_change_password = false,
      email = excluded.email;

insert into public.admins (user_id)
select u.id from auth.users u
where u.email = 'freeeng21cen@gmail.com'
on conflict (user_id) do nothing;

-- ── Verify: app_role must say 'admin' ──────────────────────────────────────
select
  u.email,
  u.id,
  (u.email_confirmed_at is not null) as email_confirmed,
  p.role                             as app_role,
  p.must_change_password
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'freeeng21cen@gmail.com';
