/* Fluence International — Partner data + shared constants */

export type ProgramKey =
  | 'B.Tech'
  | 'B.Arch'
  | 'B.Sc Nursing'
  | 'GNM'
  | 'MBBS'
  | 'Degree'
  | 'PU'
  | 'Management'
  | 'MLT'
  | 'Other';

export type City = 'Bangalore' | 'Coimbatore' | 'Mangalore' | 'Chennai' | 'Kerala';

export interface Partner {
  name: string;
  city: City;
  programs: ProgramKey[];
}

export interface ProgramOption {
  key: ProgramKey;
  label: string;
  desc: string;
}

export type Status = 'Lead' | 'Contacted' | 'Documents verified' | 'Admitted' | 'Lost';

export interface StatusStyle {
  c: string;
  bg: string;
}

export const PARTNERS: Partner[] = [
  // Bangalore
  { name: 'Christ (Deemed to be University)', city: 'Bangalore', programs: ['B.Tech', 'B.Arch', 'Degree', 'PU'] },
  { name: 'M. S. Ramaiah Institute of Technology', city: 'Bangalore', programs: ['B.Tech'] },
  { name: 'Kristu Jayanti College', city: 'Bangalore', programs: ['B.Tech', 'Degree'] },
  { name: 'JAIN (Deemed-to-be University)', city: 'Bangalore', programs: ['B.Tech', 'Degree', 'PU'] },
  { name: 'REVA University', city: 'Bangalore', programs: ['B.Tech'] },
  { name: 'T. John Group of Institutions', city: 'Bangalore', programs: ['B.Tech', 'B.Sc Nursing', 'GNM', 'Management', 'Degree', 'PU'] },
  { name: 'East West Institute of Technology', city: 'Bangalore', programs: ['B.Tech'] },
  { name: 'East Point Group of Institutions', city: 'Bangalore', programs: ['B.Tech'] },
  { name: 'M. S. Ramaiah School of Architecture', city: 'Bangalore', programs: ['B.Arch'] },
  { name: 'BMS College of Architecture', city: 'Bangalore', programs: ['B.Arch'] },
  { name: "St. Joseph's University", city: 'Bangalore', programs: ['Degree'] },
  { name: 'Mount Carmel College', city: 'Bangalore', programs: ['Degree'] },
  { name: 'Sri Siddhartha Institute of Nursing', city: 'Bangalore', programs: ['B.Sc Nursing', 'GNM'] },

  // Coimbatore
  { name: 'PPG Group of Institutions', city: 'Coimbatore', programs: ['B.Tech', 'Degree', 'Management'] },
  { name: 'PSG Institutions', city: 'Coimbatore', programs: ['B.Tech', 'Degree', 'Management'] },
  { name: 'Unity Institutions', city: 'Coimbatore', programs: ['B.Tech', 'Degree'] },
  { name: 'Hindusthan Educational Institutions', city: 'Coimbatore', programs: ['B.Tech', 'Degree', 'Management'] },

  // Mangalore
  { name: 'Srinivas Institute of Medical Sciences & Research Centre', city: 'Mangalore', programs: ['B.Sc Nursing', 'GNM'] },
  { name: 'A.J. Institute of Medical Sciences & Research Centre', city: 'Mangalore', programs: ['B.Sc Nursing', 'GNM'] },
  { name: 'Kanachur Institute of Medical Sciences', city: 'Mangalore', programs: ['B.Sc Nursing', 'GNM'] },
  { name: 'Aaliyah College of Nursing', city: 'Mangalore', programs: ['B.Sc Nursing', 'GNM'] },
  { name: 'Athena College of Nursing', city: 'Mangalore', programs: ['B.Sc Nursing', 'GNM'] },
  { name: 'Yenepoya (Deemed to be University)', city: 'Mangalore', programs: ['B.Arch'] },
  { name: 'Srinivas University', city: 'Mangalore', programs: ['B.Tech', 'Degree'] },

  // Chennai
  { name: 'SRM Institute of Science and Technology', city: 'Chennai', programs: ['B.Tech', 'B.Arch', 'B.Sc Nursing', 'GNM', 'MBBS', 'Degree'] },
  { name: 'Chettinad Academy of Research and Education', city: 'Chennai', programs: ['B.Sc Nursing', 'MBBS', 'Degree'] },
  { name: 'Hindustan Institute of Technology and Science', city: 'Chennai', programs: ['B.Tech', 'B.Arch', 'Degree'] },

  // Kerala
  { name: 'Al-Azhar Group of Institutions, Thodupuzha', city: 'Kerala', programs: ['B.Sc Nursing', 'GNM', 'MLT', 'Management'] },
  { name: 'Mount Zion College of Nursing, Adoor', city: 'Kerala', programs: ['B.Sc Nursing'] },
  { name: 'KMCT Group of Institutions, Kozhikode', city: 'Kerala', programs: ['GNM', 'MLT'] },
  { name: 'Rajagiri School of Engineering & Technology', city: 'Kerala', programs: ['B.Tech'] },
  { name: 'Rajagiri Business School', city: 'Kerala', programs: ['Management'] },
  { name: 'Sacred Heart College, Thevara', city: 'Kerala', programs: ['Degree'] },
];

export const CITIES: City[] = ['Bangalore', 'Coimbatore', 'Mangalore', 'Chennai', 'Kerala'];

export const PROGRAMS: ProgramOption[] = [
  { key: 'B.Tech',       label: 'B.Tech',         desc: 'Engineering & Technology' },
  { key: 'B.Arch',       label: 'B.Arch',         desc: 'Architecture programs' },
  { key: 'B.Sc Nursing', label: 'B.Sc Nursing',   desc: 'Nursing & allied health' },
  { key: 'GNM',          label: 'GNM',            desc: 'General Nursing & Midwifery' },
  { key: 'MBBS',         label: 'MBBS',           desc: 'Medicine & surgery' },
  { key: 'Degree',       label: 'Degree',         desc: 'B.A · B.Com · B.Sc' },
  { key: 'PU',           label: 'Pre-University', desc: 'Class 11–12 (PU)' },
  { key: 'Management',   label: 'Management',     desc: 'MBA · BBA · Business Schools' },
  { key: 'MLT',          label: 'MLT',            desc: 'Medical Lab Technology' },
  { key: 'Other',        label: 'Other',          desc: 'A program not listed above' },
];

export const CITY_COLOR: Record<City, string> = {
  Bangalore:  '#1B9A9E',
  Coimbatore: '#DC7E14',
  Mangalore:  '#117478',
  Chennai:    '#F39A2C',
  Kerala:     '#0E6E70',
};

/* Active funnel only — order matters: nextStatus(current) returns the
   element one index later. `Lost` is a separate terminal status set by
   the admin manually; it's not part of the auto-advance chain. */
export const STATUS_FLOW: Status[] = ['Lead', 'Contacted', 'Documents verified', 'Admitted'];

/* Full set of statuses an admin can pick from / filter by. */
export const ALL_STATUSES: Status[] = [...STATUS_FLOW, 'Lost'];

export const STATUS_STYLE: Record<Status, StatusStyle> = {
  'Lead':               { c: '#b45309',           bg: 'rgba(180, 83, 9, .10)' },
  'Contacted':          { c: 'var(--teal-deep)',  bg: 'rgba(27,154,158,.10)' },
  'Documents verified': { c: 'var(--orange-deep)', bg: 'rgba(243,154,44,.10)' },
  'Admitted':           { c: '#1a7a44',           bg: 'rgba(26,122,68,.10)' },
  'Lost':               { c: '#9aa0aa',           bg: 'rgba(154,160,170,.14)' },
};

export const MEDICAL_PROGRAMS: Set<ProgramKey> = new Set(['MBBS', 'B.Sc Nursing', 'GNM', 'MLT']);

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES: ReadonlyArray<string> = ['application/pdf', 'image/jpeg', 'image/png'];

export const CONTACT = {
  phone: '+91 85890 14122',
  phoneHref: 'tel:+918589014122',
  email: 'fluenceadmission@gmail.com',
  emailHref: 'mailto:fluenceadmission@gmail.com',
  address: 'West of YMCA, Alappuzha, Kerala — 688001',
  whatsappCommunity: 'https://chat.whatsapp.com/GTUb7qG70Z0LFhqEMiFG4X?mode=gi_t',
} as const;

/* Admission cycle — surfaced in the hero status card.
   No hard-coded close date: partners close intake on rolling, first-come
   basis, so we drive urgency from real policy + counsellor SLA instead. */
export const ADMISSION_CYCLE = {
  year: 2026,
  responseSLA: '~2 hours',
} as const;
