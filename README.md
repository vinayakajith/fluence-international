# Fluence International

Admission guidance web app for B.Tech, MBBS, Nursing, Degree and more. Students submit a 4-step enquiry form and a counsellor follows up within 2–48 hours.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Plain CSS (design tokens, no framework) |
| Backend / DB | Supabase (Postgres + Storage + Auth) |
| Auth | Supabase Anonymous Auth (public form) + Password Auth (admin) |
| Deployment | Static host (Netlify / Vercel / any CDN) |

## Project structure

```
src/
  components/       Landing page components (Nav, Hero, Partners, Footer, ErrorBoundary)
  enquiry/          Multi-step form (steps 1–4, file upload, success screen)
  admin/            Admin dashboard (applicant list, drawer, login)
  lib/              Supabase client + AuthProvider
  utils/            storage.ts · validation.ts · format.ts
  data.ts           Partner colleges, programs, constants
  styles.css        All styles — design tokens at :root, component styles below
supabase/
  schema.sql        Full Postgres schema + RLS policies + RPCs
public/
  assets/           Static images
index.html          Entry point — meta tags, fonts, OG tags
```

## Local development

### 1. Prerequisites

- Node 18+
- A Supabase project (free tier works)

### 2. Clone and install

```bash
git clone <repo-url>
cd Fluence
npm install
```

### 3. Environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are in **Supabase → Project Settings → API**.

### 4. Database setup

Run the schema against your Supabase project:

```bash
# Via the Supabase dashboard SQL editor, or:
supabase db push   # if using the Supabase CLI
```

The schema is at `supabase/schema.sql`. It creates:
- `applications` table with all form fields
- Row-level security policies (anon can insert/update own rows; admin email can read all)
- `update_application_full` and `save_file_metas` RPCs
- `documents` storage bucket for marksheet uploads

### 5. Supabase Storage

Create a private bucket named **`documents`** in Supabase → Storage. The schema may already do this; if not:

```sql
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);
```

### 6. Admin user

Create an admin user in **Supabase → Authentication → Users → Add user**. Use an email address. The RLS policy grants admin read access to rows where `auth.jwt() ->> 'email'` matches the configured admin email.

Update the RLS policy in `schema.sql` to use your admin email before running it.

### 7. Run dev server

```bash
npm run dev
```

Opens on `http://localhost:5173`.

## Available scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server on port 5173 |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview production build on port 4173 |
| `npm run typecheck` | Type-check without building |

## Deployment

The app is a fully static SPA (hash-based routing — no server-side routing needed).

```bash
npm run build
# Upload dist/ to any static host
```

**Netlify / Vercel:** set the build command to `npm run build` and publish directory to `dist`. Add the two env vars in the dashboard.

**Environment variables required in production:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Key design decisions

**Anonymous auth** — The public enquiry form uses Supabase Anonymous Auth. Each visitor gets a unique anonymous UID before the form loads. This UID scopes their file uploads in Storage (`{uid}/{appId}/...`) and is enforced by RLS so users can only write their own rows.

**Partial lead capture** — When a visitor completes Step 1 (name + phone), a `Lead` row is immediately inserted. If they abandon steps 2–4, the lead is still captured for follow-up.

**No entrance test requirement** — Direct admission guidance is the core value prop. Entrance exam scores are collected but optional.

**File uploads are non-fatal** — If a document upload fails (network error, auth issue), the application itself is still saved. The user sees a warning to send documents directly via WhatsApp or email.

## Form steps

| Step | Name | Required fields |
|------|------|----------------|
| 1 | Basic Details | Study level, full name, phone, state |
| 2 | Academic Details | 10th marks + marksheet, 12th marksheet |
| 3 | College Preferences | Program, optional city + college |
| 4 | Review & Submit | — (confirmation only) |

## Admin dashboard

Navigate to `/#admin`. Requires email + password (Supabase Auth). Features:
- View all applicants, search, filter by status
- Update application status through the pipeline: Lead → Contacted → Documents verified → Admitted
- Download uploaded marksheets (signed URL, 1-hour expiry)
- Delete applicants

## Contact

**Fluence International**  
West of YMCA, Alappuzha, Kerala — 688001  
+91 85890 14122 · fluenceadmission@gmail.com
