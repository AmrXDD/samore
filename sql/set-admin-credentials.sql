-- ============================================================================
-- SAMORE — Update the administrator credentials
--   New email:    freeeng21cen@gmail.com
--   New password: sameh111
--
-- Run in the Supabase SQL editor (or psql). Safe to re-run.
-- This updates the seeded admin (admin@samore.com) in place. If that admin
-- was already renamed, it also matches on the fixed seed id.
-- ============================================================================

do $$
declare
  target_id  uuid;
  new_email  text := 'freeeng21cen@gmail.com';
  new_pass   text := 'sameh111';
begin
  -- Locate the admin: by the seeded id, the original email, or the new email.
  select id into target_id
  from auth.users
  where id = '11111111-1111-1111-1111-111111111111'
     or email = 'admin@samore.com'
     or email = new_email
  order by (email = new_email) desc
  limit 1;

  if target_id is null then
    raise exception 'No admin user found to update. Run sql/schema.sql first.';
  end if;

  -- Update auth.users: email + password (bcrypt) + confirm.
  update auth.users
  set email              = new_email,
      encrypted_password = crypt(new_pass, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at         = now()
  where id = target_id;

  -- Keep the email identity in sync.
  update auth.identities
  set identity_data = jsonb_set(
        jsonb_set(coalesce(identity_data, '{}'::jsonb), '{email}', to_jsonb(new_email), true),
        '{email_verified}', 'true'::jsonb, true
      ),
      updated_at = now()
  where user_id = target_id and provider = 'email';

  -- Update the profile: email, admin role, and clear the forced change flag
  -- (a real password is being set, so no first-login change is required).
  update public.profiles
  set email                = new_email,
      role                 = 'admin',
      must_change_password  = false
  where id = target_id;

  -- Ensure the admins allow-list contains this user.
  insert into public.admins (user_id) values (target_id)
  on conflict (user_id) do nothing;

  raise notice 'Admin updated: % (%).', new_email, target_id;
end $$;
