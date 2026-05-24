import { Field } from './Field';
import { StateSelect } from './StateSelect';
import type { FormData } from './types';
import type { Errors } from '../utils/validation';

interface StepPersonalProps {
  data: FormData;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Errors;
}

export function StepPersonal({ data, set, errors }: StepPersonalProps) {
  return (
    <div>
      <div className="wiz-step-head">
        <div className="eyebrow">Basic Details · Step 1 of 4</div>
        <h2>Tell us <span className="it">about you.</span></h2>
        <div className="help">Just the basics — takes under a minute.</div>
      </div>

      <div className="field full" style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          I'm applying for <span className="req">*</span>
        </label>
        <div className="level-toggle">
          <button type="button" className={`level-btn ${data.studyLevel === 'UG' ? 'active' : ''}`} onClick={() => set('studyLevel', 'UG')}>
            <span className="level-title">Undergraduate (UG)</span>
            <span className="level-sub">B.Tech · B.Arch · MBBS · Nursing · Degree…</span>
          </button>
          <button type="button" className={`level-btn ${data.studyLevel === 'PG' ? 'active' : ''}`} onClick={() => set('studyLevel', 'PG')}>
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

        <Field label="Mobile number" required error={errors.phone}>
          <input type="tel" placeholder="+91 ··········" value={data.phone} inputMode="tel" autoComplete="tel"
            onChange={e => set('phone', e.target.value)} />
        </Field>

        <div className={`field ${errors.state ? 'has-error' : ''}`}>
          <label>State <span className="req">*</span></label>
          <StateSelect value={data.state} onChange={v => set('state', v)} error={errors.state} />
          {errors.state && <div className="field-error">{errors.state}</div>}
        </div>

        <div className="field full">
          <Field label="District / City" hint="Optional">
            <input type="text" placeholder="e.g. Pune, Coimbatore, Patna…" value={data.city} autoComplete="address-level2"
              onChange={e => set('city', e.target.value)} />
          </Field>
        </div>
      </div>
    </div>
  );
}
