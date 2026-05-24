import type { ProgramKey, City, Status } from '../data';
import type { FileMeta } from '../enquiry/types';

export interface Application {
  id: string;
  submittedAt: string;
  status: Status;
  studyLevel: string;

  fullName: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  state: string;

  tenthBoard: string;
  tenthYear: string;
  tenthPct: string;
  tenthFile: FileMeta | null;

  eleventhSchool: string;
  eleventhStream: string;
  eleventhFile: FileMeta | null;

  twelfthBoard: string;
  twelfthYear: string;
  twelfthPct: string;
  twelfthFile: FileMeta | null;

  ugFile: FileMeta | null; // UG degree certificate — for PG applicants

  jeeScore: string;
  neetScore: string;
  cetScore: string;

  preferredProgram: ProgramKey | '';
  otherProgram?: string;
  preferredCity: City | '';
  preferredUniversity: string;
  goals: string;
}
