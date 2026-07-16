-- ============================================================================
-- SAMORE — FIX ADMIN LOGIN  ("Invalid email or password")
--
-- Cause: users inserted into auth.users directly via SQL get NULL in several
-- token columns. Supabase's auth service (GoTrue) cannot read NULL into those
-- fields and rejects the sign-in as "Invalid email or password", even when the
-- password is correct. This script repairs the row and resets the password.
--
-- Run this whole file in the Supabase SQL editor. Safe to re-run.
--
--   Email:    freeeng21cen@gmail.com
--   Password: sameh111
-- ============================================================================

do $$
declare
  target_id uuid;
  v_email   text := 'freeeng21cen@gmail.com';
  v_pass    text := 'sameh111';
  col       text;
begin
  -- 1. Find the admin (new email, the original seed email, or the seed id).
  select id into target_id
  from auth.users
  where email = v_email
     or email = 'admin@samore.com'
     or id = '11111111-1111-1111-1111-111111111111'
  order by (email = v_email) desc
  limit 1;

  -- 2. If no user exists at all, create one properly.
  if target_id is null then
    target_id := gen_random_uuid();
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      target_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      v_email,
      crypt(v_pass, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"SAMORE Administrator","role":"admin"}'::jsonb,
      now(), now(),
      '', '', '', ''
    );
    raise notice 'Created new admin user %', v_email;
  end if;

  -- 3. Reset email + password and confirm the address.
  update auth.users
  set email              = v_email,
      encrypted_password = crypt(v_pass, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      aud                = 'authenticated',
      role               = 'authenticated',
      raw_app_meta_data  = '{"provider":"email","providers":["email"]}'::jsonb,
      updated_at         = now(),
      -- clear any lockout / pending states
      banned_until       = null
  where id = target_id;

  -- 4. THE ACTUAL FIX — GoTrue cannot read NULL from these columns.
  --    Replace every NULL with an empty string. Column names differ between
  --    Supabase versions, so only touch the ones that exist.
  foreach col in array array[
    'confirmation_token',
    'recovery_token',
    'email_change_token_new',
    'email_change',
    'email_change_token_current',
    'phone_change',
    'phone_change_token',
    'reauthentication_token'
  ]
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'auth' and table_name = 'users' and column_name = col
    ) then
      execute format(
        'update auth.users set %I = coalesce(%I, %L) where id = %L',
        col, col, '', target_id
      );
    end if;
  end loop;

  -- 5. Make sure the email identity exists and matches.
  if exists (select 1 from auth.identities where user_id = target_id and provider = 'email') then
    update auth.identities
    set identity_data = jsonb_build_object(
          'sub', target_id::text, 'email', v_email, 'email_verified', true
        ),
        updated_at = now()
    where user_id = target_id and provider = 'email';
  else
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), target_id::text, target_id,
      jsonb_build_object('sub', target_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );
  end if;

  -- 6. Grant admin rights in the app (this is what /admin checks).
  insert into public.profiles (id, email, full_name, role, must_change_password)
  values (target_id, v_email, 'SAMORE Administrator', 'admin', false)
  on conflict (id) do update
    set email = v_email, role = 'admin', must_change_password = false;

  insert into public.admins (user_id) values (target_id)
  on conflict (user_id) do nothing;

  raise notice 'Admin login repaired: % (id %)', v_email, target_id;
end $$;


-- ============================================================================
-- VERIFY — run this after. Every column should look correct.
-- ============================================================================
select
  u.email,
  (u.encrypted_password is not null)            as has_password,
  (u.email_confirmed_at is not null)            as email_confirmed,
  u.aud,
  u.role                                        as auth_role,
  p.role                                        as app_role,
  p.must_change_password,
  (select count(*) from auth.identities i where i.user_id = u.id) as identities,
  (u.confirmation_token is not null)            as tokens_fixed
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'freeeng21cen@gmail.com';
