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
  goals                text        DEFAULT '',

  study_level          text        DEFAULT 'UG',
  ug_file              jsonb,

  -- Owned by the anonymous session that submitted the form
  user_id              uuid        DEFAULT auth.uid()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Grants
-- anon role: no direct access (form users sign in anonymously → become authenticated)
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;

-- ============================================================
-- RLS policies
-- ============================================================

-- INSERT: any authenticated session can submit (anon or email user).
--         user_id is filled by DEFAULT auth.uid() automatically.
CREATE POLICY "insert_authenticated"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- SELECT: own row (anon session) or admin email
CREATE POLICY "select_own_or_admin"
  ON applications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com'
  );

-- UPDATE: admin only. Form users write file metadata via save_file_metas() RPC.
CREATE POLICY "update_admin"
  ON applications FOR UPDATE
  TO authenticated
  USING  ((auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com');

-- DELETE: admin only
CREATE POLICY "delete_admin"
  ON applications FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'fluenceadmissions@gmail.com');

-- ============================================================
-- RPC: save_file_metas
-- SECURITY DEFINER so it bypasses the admin-only UPDATE policy,
-- but it hard-codes which columns can change and enforces ownership.
-- ============================================================
CREATE OR REPLACE FUNCTION save_file_metas(
  p_app_id        text,
  p_tenth_file    jsonb DEFAULT NULL,
  p_eleventh_file jsonb DEFAULT NULL,
  p_twelfth_file  jsonb DEFAULT NULL,
  p_ug_file       jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE applications
  SET
    tenth_file    = p_tenth_file,
    eleventh_file = p_eleventh_file,
    twelfth_file  = p_twelfth_file,
    ug_file       = p_ug_file
  WHERE id = p_app_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Row not found or permission denied';
  END IF;
END;
$$;

-- ============================================================
-- RPC: update_application_full
-- Called on final submit when a partial lead already exists.
-- SECURITY DEFINER: bypasses admin-only UPDATE policy but enforces
-- ownership internally and excludes status/user_id/submitted_at.
-- ============================================================
CREATE OR REPLACE FUNCTION update_application_full(p_app_id text, p_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE applications SET
    full_name            = p_data->>'full_name',
    email                = p_data->>'email',
    phone                = p_data->>'phone',
    dob                  = p_data->>'dob',
    city                 = p_data->>'city',
    state                = p_data->>'state',
    study_level          = p_data->>'study_level',
    tenth_board          = p_data->>'tenth_board',
    tenth_year           = p_data->>'tenth_year',
    tenth_pct            = p_data->>'tenth_pct',
    eleventh_school      = p_data->>'eleventh_school',
    eleventh_stream      = p_data->>'eleventh_stream',
    twelfth_board        = p_data->>'twelfth_board',
    twelfth_year         = p_data->>'twelfth_year',
    twelfth_pct          = p_data->>'twelfth_pct',
    jee_score            = p_data->>'jee_score',
    neet_score           = p_data->>'neet_score',
    cet_score            = p_data->>'cet_score',
    preferred_program    = p_data->>'preferred_program',
    other_program        = p_data->>'other_program',
    preferred_city       = p_data->>'preferred_city',
    preferred_university = p_data->>'preferred_university',
    goals                = p_data->>'goals'
  WHERE id = p_app_id AND user_id = auth.uid();
END;
$$;

-- ============================================================
-- Storage bucket policies
-- Create the "documents" bucket in the dashboard (private), then
-- add these two policies under Storage → documents → Policies.
-- ============================================================

-- Any authenticated session can upload (anon or admin)
CREATE POLICY "form_upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Admin can read / download
CREATE POLICY "admin_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND auth.jwt() ->> 'email' = 'fluenceadmissions@gmail.com');
