-- ============================================================
-- Fluence International — Supabase schema
-- Paste this into the Supabase SQL editor and run it once.
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
  id                   text PRIMARY KEY,
  submitted_at         timestamptz NOT NULL,
  status               text        NOT NULL DEFAULT 'Lead',

  full_name            text        NOT NULL DEFAULT '',
  email                text        NOT NULL DEFAULT '',
  phone                text        NOT NULL DEFAULT '',
  dob                  text        DEFAULT '',
  city                 text        DEFAULT '',
  state                text        DEFAULT '',

  tenth_board          text        DEFAULT '',
  tenth_year           text        DEFAULT '',
  tenth_pct            text        DEFAULT '',
  tenth_file           jsonb,

  eleventh_school      text        DEFAULT '',
  eleventh_stream      text        DEFAULT '',
  eleventh_file        jsonb,

  twelfth_board        text        DEFAULT '',
  twelfth_year         text        DEFAULT '',
  twelfth_pct          text        DEFAULT '',
  twelfth_file         jsonb,

  jee_score            text        DEFAULT '',
  neet_score           text        DEFAULT '',
  cet_score            text        DEFAULT '',

  preferred_program    text        DEFAULT '',
  other_program        text,
  preferred_city       text        DEFAULT '',
  preferred_university text        DEFAULT '',
  goals                text        DEFAULT ''
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Anyone (public enquiry form) can INSERT
CREATE POLICY "public_insert"
  ON applications FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only signed-in admin can read / update / delete
CREATE POLICY "admin_select"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_update"
  ON applications FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "admin_delete"
  ON applications FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Storage bucket policies
-- After creating the "documents" bucket in the dashboard go to:
--   Storage → documents → Policies → New policy
-- and add the two policies below.
-- ============================================================

-- Policy 1 — anon can upload (public enquiry form)
-- CREATE POLICY "public_upload"
--   ON storage.objects FOR INSERT
--   TO anon
--   WITH CHECK (bucket_id = 'documents');

-- Policy 2 — authenticated admin can read / download
-- CREATE POLICY "admin_read"
--   ON storage.objects FOR SELECT
--   TO authenticated
--   USING (bucket_id = 'documents');
