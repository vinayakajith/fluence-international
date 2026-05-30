# Fluence International — Admissions Platform

> **Live site:** [admissions.fluenceinternational.com](https://admissions.fluenceinternational.com/)

Admission guidance web app for B.Tech, MBBS, Nursing, Degree and more. Students submit a 4-step enquiry form and a counsellor follows up within 2–48 hours.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Plain CSS (design tokens, no framework) |
| Backend / DB | Supabase (Postgres + Storage + Auth) |
| Auth | Supabase Anonymous Auth (public form) + Email/Password Auth (admin) |
| Deployment | Static SPA — any CDN (Netlify / Vercel) |

---

## Architecture & Technical Highlights

### Supabase Row-Level Security (RLS)

Every data access rule is enforced at the database layer, not the application layer — the API cannot bypass them.

```sql
-- Public form users: insert only, own rows only
CREATE POLICY "insert_authenticated"
  ON applications FOR INSERT TO authenticated
  WITH CHECK (true);

-- SELECT: user sees only their own row; admin sees everything
CREATE POLICY "select_own_or_admin"
  ON applications FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com'
  );

-- UPDATE & DELETE: admin only — enforced in Postgres, not the frontend
CREATE POLICY "update_admin" ON applications FOR UPDATE TO authenticated
  USING  ((auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com');
```

### SECURITY DEFINER RPCs — Privilege Escalation Done Safely

Public form users can't UPDATE their own rows (prevents status/user_id tampering), yet they still need to save file metadata and complete a partial lead. Two `SECURITY DEFINER` functions bridge the gap: they run with elevated privileges but hard-code exactly which columns can change and enforce `user_id = auth.uid()` ownership before writing.

```sql
-- save_file_metas: only updates file-pointer columns, ownership enforced
-- update_application_full: lets a returning session complete a partial lead,
--   cannot touch status / user_id / submitted_at
```

### Anonymous Auth + Partial Lead Capture

Each visitor is silently signed in as an anonymous Supabase user before the form loads. When Step 1 (name + phone) is completed, a `Lead` row is immediately inserted scoped to that UID. If the user drops off, the lead is still in the database for counsellor follow-up. If they continue, the same anonymous session finishes the remaining steps — no login prompt, no cookie banners.

### Storage — Private Bucket + Signed URLs

Marksheets are uploaded to a private Supabase Storage bucket (`documents`) under the path `{uid}/{appId}/filename`. Storage RLS mirrors the table policies:

- Any authenticated session (anon or admin) can upload.
- Only the admin can read/download — signed URLs with 1-hour TTL are generated server-side when the admin opens a drawer.

```sql
CREATE POLICY "admin_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND auth.jwt() ->> 'email' = 'fluenceadmissions@gmail.com'
  );
```

### Admin Dashboard (`/#admin`)

Password-protected portal for counsellors at `/#admin`. Key features:

- **Applicant list** — search by name/phone, filter by status
- **Status pipeline** — Lead → Contacted → Documents Verified → Admitted (single-click update, persisted via admin UPDATE policy)
- **Document viewer** — generates a signed URL on demand; expiry prevents link sharing
- **Delete applicant** — hard delete with admin RLS guard

The admin route is client-side only (hash routing). The actual data protection lives in the RLS policies above — even if someone discovers the route, the Supabase API rejects any read/write that doesn't pass the JWT email check.

### Type Safety End-to-End

- Full TypeScript throughout — no `any`, explicit interfaces for every form step and API shape.
- `supabase-js` typed with the generated database types.
- `vite build` runs `tsc --noEmit` as a pre-build typecheck gate.

---

## Project Structure

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

---

## Local Development

### 1. Prerequisites

- Node 18+
- A Supabase project (free tier works)

### 2. Clone and install

```bash
git clone https://github.com/vinayakajith/fluence-international.git
cd fluence-international
npm install
```

### 3. Environment variables

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are in **Supabase → Project Settings → API**.

### 4. Database setup

Run the schema against your Supabase project (Supabase dashboard SQL editor or CLI):

```bash
supabase db push
```

The schema at `supabase/schema.sql` creates:
- `applications` table with all form fields
- RLS policies (anon can insert/update own rows via RPCs; admin email can read all)
- `update_application_full` and `save_file_metas` SECURITY DEFINER RPCs
- `documents` private storage bucket policies

### 5. Admin user

Create an admin user in **Supabase → Authentication → Users → Add user**. Update the email in the RLS policies in `schema.sql` to match before running it.

### 6. Run dev server

```bash
npm run dev
# Opens on http://localhost:5173
```

---

## Available Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server on port 5173 |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview production build on port 4173 |
| `npm run typecheck` | Type-check without building |

---

## Deployment

Fully static SPA using hash-based routing — no server-side routing needed.

```bash
npm run build
# Upload dist/ to any static host
```

**Netlify / Vercel:** set build command to `npm run build`, publish directory to `dist`. Add env vars in the dashboard.

**Required env vars in production:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Form Steps

| Step | Name | Fields |
|------|------|--------|
| 1 | Basic Details | Study level, full name, phone, state |
| 2 | Academic Details | 10th marks + marksheet, 12th marksheet |
| 3 | College Preferences | Program, optional city + college |
| 4 | Review & Submit | Confirmation |

---

## Key Design Decisions

**Anonymous auth** — No account creation friction on the public form. Supabase Anonymous Auth gives each visitor a real UID before Step 1, which scopes their Storage uploads and their RLS `user_id` check.

**Partial lead capture** — A `Lead` row is inserted on Step 1 completion. Drop-offs are still captured for counsellor follow-up — critical for a business where each inquiry has real monetary value.

**SECURITY DEFINER for selective privilege** — Rather than granting UPDATE to all authenticated users (which would allow status manipulation) or making students log in as admin to save files, SECURITY DEFINER functions expose exactly the columns each role needs, with server-side ownership checks.

**File uploads are non-fatal** — If a document upload fails (network error, auth expiry), the application row is still saved. The user sees a fallback prompt to send documents via WhatsApp or email.

**Hash routing** — Eliminates the need for server-side redirect rules. The admin portal at `/#admin` is invisible to search engines but fully functional as a direct URL.

---

## Contact

**Fluence International**
West of YMCA, Alappuzha, Kerala — 688001
+91 85890 14122 · fluenceadmissions@gmail.com
