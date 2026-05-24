import type { ProgramKey, City } from '../data';

export interface FileMeta {
  name: string;
  size: number;
  type: string;
  path?: string; // Supabase Storage path, set after upload
}

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  state: string;

  tenthBoard: string;
  tenthYear: string;
  tenthPct: string;
  tenthFile: File | null;

  eleventhSchool: string;
  eleventhStream: string;
  eleventhFile: File | null;

  twelfthBoard: string;
  twelfthYear: string;
  twelfthPct: string;
  twelfthFile: File | null;

  jeeScore: string;
  neetScore: string;
  cetScore: string;

  preferredProgram: ProgramKey | '';
  otherProgram: string;   // free-text, used when preferredProgram === 'Other'
  preferredCity: City | '';
  preferredUniversity: string;
  goals: string;
}

export const BLANK_FORM: FormData = {
  fullName: '', email: '', phone: '', dob: '',
  city: '', state: '',
  tenthBoard: '', tenthYear: '', tenthPct: '', tenthFile: null,
  eleventhSchool: '', eleventhStream: '', eleventhFile: null,
  twelfthBoard: '', twelfthYear: '', twelfthPct: '', twelfthFile: null,
  jeeScore: '', neetScore: '', cetScore: '',
  preferredProgram: '', otherProgram: '', preferredCity: '', preferredUniversity: '',
  goals: '',
};

export interface WizardStep {
  key: 'personal' | 'academic' | 'program' | 'review';
  title: string;
  subtitle: string;
}

export const STEPS: WizardStep[] = [
  { key: 'personal', title: 'Personal',  subtitle: 'Tell us about you' },
  { key: 'academic', title: 'Academic',  subtitle: 'Your school record' },
  { key: 'program',  title: 'Program',   subtitle: "What you're aiming for" },
  { key: 'review',   title: 'Review',    subtitle: 'Confirm & submit' },
];
