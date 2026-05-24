import { supabase } from '../lib/supabase';
import type { Application } from '../admin/types';
import type { Status } from '../data';
import type { FormData, FileMeta } from '../enquiry/types';

// ---- DB row shape (snake_case) ↔ Application (camelCase) ----

interface AppRow {
  id: string;
  submitted_at: string;
  status: string;
  study_level: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  state: string;
  tenth_board: string;
  tenth_year: string;
  tenth_pct: string;
  tenth_file: FileMeta | null;
  eleventh_school: string;
  eleventh_stream: string;
  eleventh_file: FileMeta | null;
  twelfth_board: string;
  twelfth_year: string;
  twelfth_pct: string;
  twelfth_file: FileMeta | null;
  ug_file: FileMeta | null;
  jee_score: string;
  neet_score: string;
  cet_score: string;
  preferred_program: string;
  other_program: string | null;
  preferred_city: string;
  preferred_university: string;
  goals: string;
}

function fromRow(r: AppRow): Application {
  return {
    id: r.id,
    submittedAt: r.submitted_at,
    status: r.status as Status,
    studyLevel: r.study_level ?? 'UG',
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    dob: r.dob ?? '',
    city: r.city ?? '',
    state: r.state ?? '',
    tenthBoard: r.tenth_board ?? '',
    tenthYear: r.tenth_year ?? '',
    tenthPct: r.tenth_pct ?? '',
    tenthFile: r.tenth_file ?? null,
    eleventhSchool: r.eleventh_school ?? '',
    eleventhStream: r.eleventh_stream ?? '',
    eleventhFile: r.eleventh_file ?? null,
    twelfthBoard: r.twelfth_board ?? '',
    twelfthYear: r.twelfth_year ?? '',
    twelfthPct: r.twelfth_pct ?? '',
    twelfthFile: r.twelfth_file ?? null,
    ugFile: r.ug_file ?? null,
    jeeScore: r.jee_score ?? '',
    neetScore: r.neet_score ?? '',
    cetScore: r.cet_score ?? '',
    preferredProgram: (r.preferred_program ?? '') as Application['preferredProgram'],
    otherProgram: r.other_program ?? undefined,
    preferredCity: (r.preferred_city ?? '') as Application['preferredCity'],
    preferredUniversity: r.preferred_university ?? '',
    goals: r.goals ?? '',
  };
}

function toRow(a: Application): AppRow {
  return {
    id: a.id,
    submitted_at: a.submittedAt,
    status: a.status,
    study_level: a.studyLevel,
    full_name: a.fullName,
    email: a.email,
    phone: a.phone,
    dob: a.dob,
    city: a.city,
    state: a.state,
    tenth_board: a.tenthBoard,
    tenth_year: a.tenthYear,
    tenth_pct: a.tenthPct,
    tenth_file: a.tenthFile,
    eleventh_school: a.eleventhSchool,
    eleventh_stream: a.eleventhStream,
    eleventh_file: a.eleventhFile,
    twelfth_board: a.twelfthBoard,
    twelfth_year: a.twelfthYear,
    twelfth_pct: a.twelfthPct,
    twelfth_file: a.twelfthFile,
    ug_file: a.ugFile,
    jee_score: a.jeeScore,
    neet_score: a.neetScore,
    cet_score: a.cetScore,
    preferred_program: a.preferredProgram,
    other_program: a.otherProgram ?? null,
    preferred_city: a.preferredCity,
    preferred_university: a.preferredUniversity,
    goals: a.goals,
  };
}

// ---- CRUD ----

export async function listApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data as AppRow[]).map(fromRow);
}

export async function findApplication(id: string): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as AppRow) : null;
}

export async function upsertApplication(record: Application): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .upsert(toRow(record), { onConflict: 'id' });
  if (error) throw error;
}

export async function updateApplicationStatus(id: string, status: Status): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ---- File uploads ----

export async function uploadDocuments(appId: string, data: FormData): Promise<{
  tenthFile: FileMeta | null;
  eleventhFile: FileMeta | null;
  twelfthFile: FileMeta | null;
  ugFile: FileMeta | null;
}> {
  async function upload(file: File | null, field: string): Promise<FileMeta | null> {
    if (!file) return null;
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${appId}/${field}.${ext}`;
    const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
    if (error) throw error;
    return { name: file.name, size: file.size, type: file.type, path };
  }

  const [tenthFile, eleventhFile, twelfthFile, ugFile] = await Promise.all([
    upload(data.tenthFile, 'tenth'),
    upload(data.eleventhFile, 'eleventh'),
    upload(data.twelfthFile, 'twelfth'),
    upload(data.ugFile, 'ug_degree'),
  ]);
  return { tenthFile, eleventhFile, twelfthFile, ugFile };
}
