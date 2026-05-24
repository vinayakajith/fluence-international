import type { FormData } from '../enquiry/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]{7,}$/;

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s);
}

export function isValidPhone(s: string): boolean {
  return PHONE_RE.test(s);
}

export function isValidPercent(s: string): boolean {
  if (!s) return false;
  const num = parseFloat(s.replace(/[^\d.]/g, ''));
  if (Number.isNaN(num)) return false;
  return num >= 0 && num <= 100;
}

export type Errors = Partial<Record<keyof FormData, string>>;

export function validateStep(step: number, data: FormData): Errors {
  const errors: Errors = {};

  if (step === 0) {
    // Sales-team minimum: enough to call. Email and DOB are encouraged but
    // optional so a half-finished form still gives the team someone to reach.
    if (!data.fullName.trim())             errors.fullName = 'Required';
    if (!data.phone.trim())                errors.phone = 'Required';
    else if (!isValidPhone(data.phone))    errors.phone = 'Enter a valid phone number';
    if (!data.city.trim())                 errors.city = 'Required';
    if (!data.state.trim())                errors.state = 'Required';
    // If they did fill email, make sure it's well-formed.
    if (data.email.trim() && !isValidEmail(data.email)) errors.email = 'Enter a valid email';
  }

  if (step === 1) {
    if (!data.tenthBoard)                          errors.tenthBoard = 'Required';
    if (!data.tenthYear)                           errors.tenthYear = 'Required';
    if (!data.tenthPct)                            errors.tenthPct = 'Required';
    else if (!isValidPercent(data.tenthPct))       errors.tenthPct = 'Enter a number between 0 and 100';
    if (!data.tenthFile)                           errors.tenthFile = 'Upload your 10th marksheet';
    if (data.twelfthPct && !isValidPercent(data.twelfthPct)) errors.twelfthPct = 'Enter a number between 0 and 100';
  }

  if (step === 2) {
    if (!data.preferredProgram)                                  errors.preferredProgram = 'Pick a program';
    else if (data.preferredProgram === 'Other' && !data.otherProgram.trim()) {
      errors.otherProgram = 'Please describe the program you want';
    }
  }

  return errors;
}
