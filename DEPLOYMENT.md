# SAMORE — Production Deployment Guide

This project is deployable immediately after adding environment variables.

---

## 1. Supabase (database, auth, storage)

1. **Create the project** at [supabase.com](https://supabase.com) and note the project ref.
2. **Apply the schema.** Choose one:
   - SQL editor → paste `sql/schema.sql` → **Run**.
   - CLI:
     ```bash
     supabase link --project-ref <ref>
     supabase db push
     ```
   This creates all tables, indexes, foreign keys, views, functions, triggers, RLS policies, storage buckets, realtime publications, seed data and the **seed admin** (`admin@samore.com` / `ChangeMe123!`).
3. **Grab the keys** — Project Settings → API:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**server-only, never expose**)
4. **Auth settings** — Authentication → Providers → Email is enabled; **disable sign-ups** (already off via `config.toml` locally; toggle "Allow new users to sign up" **off** in the dashboard for hosted).
5. **Edge function (optional)**
   ```bash
   supabase functions deploy send-email
   supabase secrets set RESEND_API_KEY=... EMAIL_FROM="SAMORE <no-reply@samore-eng.com>" EDGE_FUNCTION_SECRET=<random>
   ```

---

## 2. Vercel (recommended)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel → **New Project** → import the repo. Framework preset: **Next.js** (auto-detected).
3. Add Environment Variables (Production + Preview):
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   RESEND_API_KEY=...
   EMAIL_FROM=SAMORE <no-reply@samore-eng.com>
   EMAIL_TO=SAMORE2021@gmail.com
   EDGE_FUNCTION_SECRET=...
   ```
4. **Deploy.** Then set your custom domain and update `NEXT_PUBLIC_SITE_URL`.
5. In Supabase → Authentication → URL Configuration, add your production URL to **Site URL** and **Redirect URLs**.

---

## 3. Docker (self-hosted)

The app is configured for `output: "standalone"`.

```bash
# Build (public env is baked at build time; secrets injected at runtime)
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
  -t samore-web .

# Run
docker run -p 3000:3000 --env-file .env.local samore-web
```

### docker-compose

```bash
# Reads variables from your shell / .env
docker compose up -d --build
```

`docker-compose.yml` includes a health check that polls `/`.

---

## 4. Email (Resend)

1. Create an API key at [resend.com](https://resend.com).
2. Verify your sending domain (e.g. `samore-eng.com`) and set `EMAIL_FROM` to a verified address.
3. Set `EMAIL_TO` to the internal inbox that receives contact + order notifications.

If `RESEND_API_KEY` is absent, all email sends are safely skipped (logged) — the app still functions.

---

## 5. Post-deployment checklist

- [ ] Schema applied; seed admin exists.
- [ ] Signed in at `/login` and **changed the default password**.
- [ ] Disabled public sign-ups in Supabase Auth.
- [ ] Set bank details in **Admin → Settings → Bank Details**.
- [ ] Set the homepage hero in **Admin → Settings → Homepage Hero** (optional).
- [ ] Created at least one **published** course.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live domain (affects SEO, sitemap, LOI links).
- [ ] Supabase Auth redirect URLs include the live domain.
- [ ] Verified `/sitemap.xml` and `/robots.txt` respond.
- [ ] Ran a test checkout: LOI generated, receipt uploaded, admin approval unlocks.

---

## 6. Operations

- **Backups:** enable Supabase daily backups (Project Settings → Database).
- **Rate limiting:** in-memory per instance. For multi-region, back `lib/rate-limit.ts` with Upstash Redis.
- **Logs:** Vercel → Deployments → Functions; Supabase → Logs.
- **Realtime:** `payments`, `contact_messages`, `course_registrations`, `activity_logs` are published for realtime subscriptions.
