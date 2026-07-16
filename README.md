# SAMORE — Corporate Website & Admin Platform

Production-grade company website for **SAMORE** (SAMORE Engineering Construction Agriculture Industry and Trade Limited Company), covering the company's three trades — **Engineering & Construction**, **Steel Trading**, and **Oil Trading** — plus a full course-sales system with bank-transfer checkout, automatic Letter-of-Intent (LOI) generation, and an enterprise admin dashboard.

The navigation, homepage tree, and routing are a **1:1 replica of the official SAMORE company hierarchy chart** — no service added, none removed.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS · shadcn/ui · Framer Motion · Lucide icons |
| Data | Supabase (Postgres, Auth, Storage, Edge Functions, Realtime) |
| Forms | React Hook Form-compatible · Zod validation · Server Actions |
| Client data | TanStack Query |
| Email | React Email + Resend (integration-ready) |
| Documents | LOI PDF generation with `pdf-lib` |
| Payments | **Bank transfer only** (no Stripe / cards) |

Design language: ultra-minimal luxury corporate — off-white `#FAF9F6`, pure-black ink, 12px radii, black buttons that invert on hover, generous whitespace, restrained fade motion.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# then fill in your Supabase + Resend values

# 3. Provision the database (see "Supabase setup" below)

# 4. Run
npm run dev        # http://localhost:3000
```

The site **builds and runs without Supabase configured** (public pages render; database-backed features degrade gracefully). Add environment variables to unlock the full platform.

---

## Environment variables

See [`.env.example`](.env.example). Summary:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonicals, sitemap, LOI links |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only; admin operations & storage |
| `RESEND_API_KEY` | optional | Transactional email (no-ops if unset) |
| `EMAIL_FROM` / `EMAIL_TO` | optional | Sender + internal inbox |
| `EDGE_FUNCTION_SECRET` | optional | Protects the `send-email` edge function |

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema — **one file, everything included** (tables, RLS, storage buckets, functions, triggers, realtime, seed data, seed admin):

   **Option A — SQL editor:** paste [`sql/schema.sql`](sql/schema.sql) and run.

   **Option B — CLI:**
   ```bash
   supabase link --project-ref <your-ref>
   supabase db push            # applies supabase/migrations/*
   ```

   **Option C — local:**
   ```bash
   supabase start
   supabase db reset           # runs migrations + seed
   ```
3. Copy the URL, `anon` key and `service_role` key into `.env.local`.
4. (Optional) Deploy the edge function:
   ```bash
   supabase functions deploy send-email
   supabase secrets set RESEND_API_KEY=... EMAIL_FROM="SAMORE <no-reply@samore-eng.com>" EDGE_FUNCTION_SECRET=...
   ```

### Storage buckets (created by the schema)
`course-thumbnails` (public), `media` (public), `logos` (public), `receipts` (private), `loi` (private). Private buckets are read via short-lived signed URLs generated server-side.

### Seed admin
| | |
|---|---|
| URL | `/login` |
| Email | `admin@samore.com` |
| Password | `ChangeMe123!` |

The admin is forced to set a new password on first sign-in. Public sign-up is disabled — there is no registration page.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run email:dev` | Preview React Email templates |

---

## Project structure

```
app/
  (marketing)/            Public site (header + footer)
    page.tsx              Home — hero + interactive company hierarchy tree
    about/ contact/ courses/ [slug]/ courses/[slug]/
    privacy-policy/ terms/
  admin/                  Enterprise dashboard (guarded)
    page.tsx courses/ services/ customers/ payments/
    emails/ loi/ users/ analytics/ settings/
  login/                  Admin sign-in
  actions/                Server Actions (contact, checkout, auth, admin…)
  sitemap.ts robots.ts icon.svg globals.css layout.tsx
components/  ui/ site/ home/ service/ admin/ forms/
lib/         supabase/ services.ts constants.ts queries.ts loi.ts validations.ts …
emails/      React Email templates
types/       Domain types (mirror the SQL schema)
supabase/    config.toml · migrations/ · functions/
sql/         schema.sql  (the complete single-file schema)
public/
```

---

## Key features

- **Company hierarchy** — exact replica in `lib/constants.ts`; interactive clickable tree on the homepage; drives nav + routing.
- **Service pages** — every division, category and service, data-driven from `lib/services.ts`, each with hero, overview, capabilities, process, benefits, inquiry form, SEO metadata and JSON-LD structured data.
- **Courses** — public catalogue (empty state → "No courses available."), admin CRUD with categories, visibility (draft/published/archived).
- **Bank-transfer checkout** — details → auto-generated LOI PDF → bank instructions → receipt upload → pending verification → admin approval → unlock.
- **Admin dashboard** — sales/courses/emails/LOI/pending/approved cards, revenue & orders charts, recent customers, activity log, plus full management of courses, payments, emails, LOI, customers, users, settings and analytics.
- **Emails** — contact, course-registration, payment-pending, payment-approved, LOI-ready (Resend, gracefully skipped when unconfigured).
- **SEO** — per-page metadata, OpenGraph, Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`, canonicals.
- **Security** — Zod validation, honeypot + IP rate limiting, RLS on every table, service-role isolation, private storage with signed URLs.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for Vercel, Docker and production guidance.
