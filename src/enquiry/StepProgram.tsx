import { useEffect, useMemo, useRef } from 'react';
import { PARTNERS, PROGRAMS, CITIES } from '../data';
import type { ProgramKey, City } from '../data';
import { Icon } from '../icons';
import { CollegePicker } from './CollegePicker';
import type { FormData } from './types';
import type { Errors } from '../utils/validation';

interface StepProgramProps {
  data: FormData;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Errors;
}

export function StepProgram({ data, set, errors }: StepProgramProps) {
  const isOther = data.preferredProgram === 'Other';
  const otherCardRef = useRef<HTMLDivElement>(null);

  // When the user picks Other, scroll the custom-course card into view so
  // they don't miss the input. Especially helpful on mobile.
  useEffect(() => {
    if (isOther) {
      requestAnimationFrame(() => {
        otherCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [isOther]);

  // Filter colleges by program except when 'Other' — Other means the program
  // isn't in our preset list, so any partner could still be the right fit.
  const universities = useMemo(() => PARTNERS.filter(p => {
    if (data.preferredProgram && !isOther && !p.programs.includes(data.preferredProgram)) return false;
    if (data.preferredCity && p.city !== data.preferredCity) return false;
    return true;
  }), [data.preferredProgram, data.preferredCity, isOther]);

  useEffect(() => {
    if (data.preferredUniversity && !universities.some(u => u.name === data.preferredUniversity)) {
      set('preferredUniversity', '');
    }
  }, [universities, data.preferredUniversity, set]);

  // When the user moves away from 'Other', clear the free-text field.
  useEffect(() => {
    if (!isOther && data.otherProgram) set('otherProgram', '');
  }, [isOther, data.otherProgram, set]);

  return (
    <div>
      <div className="wiz-step-head">
        <div className="eyebrow">College Preferences · Step 3 of 4</div>
        <h2>Choose your <span className="it">program & college.</span></h2>
        <div className="help">Select a program first, then tap a partner college below. If your course isn't listed, choose <strong>Other</strong> and describe it. Leave the college blank and our counsellor will recommend the best fit.</div>
      </div>

      <div className="field">
        <label>Program <span className="req">*</span></label>
        <div className="chips" role="radiogroup" aria-label="Program">
          {PROGRAMS.map(p => {
            const isPicked = data.preferredProgram === p.key;
            const isOtherChip = p.key === 'Other';
            return (
              <button
                type="button"
                key={p.key}
                role="radio"
                aria-checked={isPicked}
                className={`chip ${isPicked ? 'active' : ''} ${isOtherChip ? 'chip-other' : ''}`}
                onClick={() => set('preferredProgram', p.key as ProgramKey)}
              >
                {isOtherChip && <span className="chip-other-mark" aria-hidden="true">+</span>}
                {p.label}
              </button>
            );
          })}
        </div>
        {errors.preferredProgram && <div className="field-error">{errors.preferredProgram}</div>}
      </div>

      {isOther && (
        <div className="other-card" role="group" aria-labelledby="other-card-title" ref={otherCardRef}>
          <div className="other-card-pointer" aria-hidden="true"/>
          <div className="other-card-head">
            <span className="other-card-tag"><Icon.Bolt size={11}/> One more thing</span>
            <span id="other-card-title" className="other-card-title">
              Tell us which course you'd like to apply for
            </span>
            <span className="other-card-sub">
              Type the program name as you know it — for example BCA, B.Pharm, Hotel Management. Our counsellor will map it to the right partner.
            </span>
          </div>
          <div className={`field ${errors.otherProgram ? 'has-error' : ''}`}>
            <label htmlFor="other-program-input">Course name <span className="req">*</span></label>
            <input
              id="other-program-input"
              type="text"
              placeholder="e.g. BCA, B.Pharm, Aviation, Hotel Management…"
              value={data.otherProgram}
              onChange={e => set('otherProgram', e.target.value)}
              autoFocus
            />
            {errors.otherProgram && <div className="field-error">{errors.otherProgram}</div>}
            {!errors.otherProgram && data.otherProgram.trim() && (
              <div className="other-confirm" aria-live="polite">
                <span className="other-confirm-icon"><Icon.Check size={11}/></span>
                Got it — we'll note <strong>{data.otherProgram.trim()}</strong> on your enquiry.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="field" style={{ marginTop: 22 }}>
        <label>Preferred city / region</label>
        <div className="chips" role="radiogroup" aria-label="City">
          <button
            type="button"
            role="radio"
            aria-checked={!data.preferredCity}
            className={`chip ${!data.preferredCity ? 'active' : ''}`}
            onClick={() => set('preferredCity', '')}
          >Any</button>
          {CITIES.map(c => (
            <button
              type="button"
              key={c}
              role="radio"
              aria-checked={data.preferredCity === c}
              className={`chip ${data.preferredCity === c ? 'active' : ''}`}
              onClick={() => set('preferredCity', c as City)}
            >{c}</button>
          ))}
        </div>
      </div>

      <CollegePicker
        selected={data.preferredUniversity}
        universities={universities}
        hasProgram={!!data.preferredProgram}
        onPick={(name) => set('preferredUniversity', name)}
      />

      <div className="field" style={{ marginTop: 26 }}>
        <label>Anything else you'd like our counsellor to know? <span className="hint-inline">Optional</span></label>
        <textarea
          rows={4}
          placeholder="Your career goals, preferred specialisation, why this college, etc."
          value={data.goals}
          onChange={e => set('goals', e.target.value)}
        />
      </div>

      <div className="field" style={{ marginTop: 18 }}>
        <label>Email <span className="hint-inline">Optional — for sharing documents &amp; updates</span></label>
        <input
          type="email"
          placeholder="you@example.com"
          value={data.email}
          inputMode="email"
          autoComplete="email"
          onChange={e => set('email', e.target.value)}
        />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>
    </div>
  );
}
