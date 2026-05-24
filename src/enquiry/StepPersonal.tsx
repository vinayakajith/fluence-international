import { Field } from './Field';
import type { FormData } from './types';
import type { Errors } from '../utils/validation';

interface StepPersonalProps {
  data: FormData;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Errors;
}

export function StepPersonal({ data, set, errors }: StepPersonalProps) {
  const todayISO = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <div className="wiz-step-head">
        <div className="eyebrow">Step 1 of 4</div>
        <h2>Tell us <span className="it">about you.</span></h2>
        <div className="help">Just the basics — we'll use this to set up your file with the university.</div>
      </div>

      {/* Study level — asked first so academic step can adapt */}
      <div className="field full" style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          I'm applying for <span className="req">*</span>
        </label>
        <div className="level-toggle">
          <button
            type="button"
            className={`level-btn ${data.studyLevel === 'UG' ? 'active' : ''}`}
            onClick={() => set('studyLevel', 'UG')}
          >
            <span className="level-title">Undergraduate (UG)</span>
            <span className="level-sub">B.Tech · B.Arch · MBBS · Nursing · Degree…</span>
          </button>
          <button
            type="button"
            className={`level-btn ${data.studyLevel === 'PG' ? 'active' : ''}`}
            onClick={() => set('studyLevel', 'PG')}
          >
            <span className="level-title">Postgraduate (PG)</span>
            <span className="level-sub">MBA · M.Tech · M.Sc · MCA…</span>
          </button>
        </div>
        {errors.studyLevel && <div className="field-error">{errors.studyLevel}</div>}
      </div>

      <div className="fgrid">
        <div className="field full">
          <Field label="Full name" required error={errors.fullName}>
            <input type="text" placeholder="As on your 10th certificate" value={data.fullName} autoComplete="name"
              onChange={e => set('fullName', e.target.value)} />
          </Field>
        </div>
        <Field label="Phone" required error={errors.phone}>
          <input type="tel" placeholder="+91 ··········" value={data.phone} inputMode="tel" autoComplete="tel"
            onChange={e => set('phone', e.target.value)} />
        </Field>
        <Field label="Email" hint="Optional, but helps us share documents" error={errors.email}>
          <input type="email" placeholder="you@example.com" value={data.email} inputMode="email" autoComplete="email"
            onChange={e => set('email', e.target.value)} />
        </Field>
        <Field label="Current city" required error={errors.city}>
          <input type="text" placeholder="e.g. Bangalore" value={data.city} autoComplete="address-level2"
            onChange={e => set('city', e.target.value)} />
        </Field>
        <Field label="State" required error={errors.state}>
          <input type="text" placeholder="e.g. Karnataka" value={data.state} autoComplete="address-level1"
            onChange={e => set('state', e.target.value)} />
        </Field>
        <Field label="Date of birth" hint="Optional" error={errors.dob}>
          <input type="date" value={data.dob} max={todayISO}
            onChange={e => set('dob', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
