-- ============================================================================
-- SAMORE — Change the admin password to: sameh122
--   Email: freeeng21cen@gmail.com
--
-- Run the whole file in the Supabase SQL editor. Safe to re-run.
-- Uses bcrypt cost 10 (GoTrue's own default) and repairs the NULL token
-- columns that make Supabase reject a SQL-created login.
-- ============================================================================

do $$
declare
  v_email text := 'freeeng21cen@gmail.com';
  v_pass  text := 'sameh122';
  uid     uuid;
  col     text;
begin
  select id into uid from auth.users where email = v_email limit 1;

  if uid is null then
    raise exception 'No user with email %. Create it in Authentication > Users first.', v_email;
  end if;

  -- Password (bcrypt, cost 10 = same as Supabase) + confirm + unban.
  update auth.users
  set encrypted_password = crypt(v_pass, gen_salt('bf', 10)),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      banned_until       = null,
      aud                = 'authenticated',
      role               = 'authenticated',
      updated_at         = now()
  where id = uid;

  -- GoTrue cannot read NULL from these; force empty strings.
  foreach col in array array[
    'confirmation_token', 'recovery_token', 'email_change_token_new',
    'email_change', 'email_change_token_current', 'phone_change',
    'phone_change_token', 'reauthentication_token'
  ]
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'auth' and table_name = 'users' and column_name = col
    ) then
      execute format('update auth.users set %I = coalesce(%I, %L) where id = %L',
                     col, col, '', uid);
    end if;
  end loop;

  -- Keep the app-side admin role intact.
  insert into public.profiles (id, email, full_name, role, must_change_password)
  values (uid, v_email, 'SAMORE Administrator', 'admin', false)
  on conflict (id) do update
    set role = 'admin', must_change_password = false, email = v_email;

  raise notice 'Password updated for % — you can now log in with sameh122', v_email;
end $$;


-- ── Verify ─────────────────────────────────────────────────────────────────
select
  u.email,
  (u.encrypted_password like '$2%')  as bcrypt_hash_ok,
  (u.email_confirmed_at is not null) as email_confirmed,
  p.role::text                       as app_role
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'freeeng21cen@gmail.com';
