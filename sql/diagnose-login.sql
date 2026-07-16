-- ============================================================================
-- SAMORE — Login diagnosis. Run this whole file; read the "verdict" column.
-- ============================================================================
select
  case
    when u.id is null then
      'FAIL: no such user in auth.users -> you are on the WRONG PROJECT, or the user was never created. Create it in Authentication > Users > Add user (tick Auto Confirm).'
    when u.email_confirmed_at is null then
      'FAIL: email not confirmed -> login is rejected. Fix: Authentication > Users > click user > Confirm email. (Or delete + re-add with "Auto Confirm User" ticked.)'
    when u.encrypted_password is null then
      'FAIL: user has no password -> set one in Authentication > Users > click user > Reset/Update password.'
    when u.banned_until is not null and u.banned_until > now() then
      'FAIL: user is banned until ' || u.banned_until::text
    when p.id is null then
      'FAIL: no profiles row -> login succeeds but /admin rejects you. Fix: run sql/promote-admin.sql.'
    when p.role::text <> 'admin' then
      'FAIL: profiles.role is "' || p.role::text || '", not "admin" -> you would see "This account is not authorized". Fix: run sql/promote-admin.sql.'
    when (select count(*) from auth.identities i where i.user_id = u.id) = 0 then
      'FAIL: no auth.identities row -> Supabase cannot match the email. Fix: delete the user and re-add via Authentication > Users > Add user.'
    else
      'PASS: this database is correct. The user CAN log in here. If the live site still fails, your site is pointing at a DIFFERENT Supabase project -> check NEXT_PUBLIC_SUPABASE_URL in Vercel, then REDEPLOY.'
  end as verdict,
  u.email,
  (u.email_confirmed_at is not null) as email_confirmed,
  (u.encrypted_password is not null) as has_password,
  p.role::text                       as app_role,
  (select count(*) from auth.identities i where i.user_id = u.id) as identities
from (select 'freeeng21cen@gmail.com'::text as target) t
left join auth.users u    on u.email = t.target
left join public.profiles p on p.id = u.id;


-- ── Which project am I connected to? Compare this to Vercel's
--    NEXT_PUBLIC_SUPABASE_URL (https://<ref>.supabase.co) ──────────────────
select current_setting('request.jwt.claim.iss', true) as issuer,
       current_database()                             as db;
