import { useMemo } from 'react';
import { Field } from './Field';
import { FileUpload } from './FileUpload';
import { MAX_FILE_BYTES } from '../data';
import { fmtFileSize } from '../utils/format';
import type { FormData } from './types';
import type { Errors } from '../utils/validation';

interface StepAcademicProps {
  data: FormData;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Errors;
}

export function StepAcademic({ data, set, errors }: StepAcademicProps) {
  const years = useMemo(() => {
    const ys: number[] = []; const now = new Date().getFullYear();
    for (let y = now + 1; y >= now - 12; y--) ys.push(y);
    return ys;
  }, []);

  return (
    <div>
      <div className="wiz-step-head">
        <div className="eyebrow">Step 2 of 4</div>
        <h2>Your <span className="it">academic record.</span></h2>
        <div className="help">Upload clear scans or photos of your marksheets. PDF, JPG or PNG · up to {fmtFileSize(MAX_FILE_BYTES)} each.</div>
      </div>

      <div className="acad-card">
        <h4>Class 10 <span className="grade-badge">Marksheet required</span></h4>
        <div className="fgrid">
          <Field label="Board" required error={errors.tenthBoard}>
            <select value={data.tenthBoard} onChange={e => set('tenthBoard', e.target.value)}>
              <option value="">Select board…</option>
              <option>CBSE</option><option>ICSE</option>
              <option>State Board</option><option>IB</option><option>Other</option>
            </select>
          </Field>
          <Field label="Year of passing" required error={errors.tenthYear}>
            <select value={data.tenthYear} onChange={e => set('tenthYear', e.target.value)}>
              <option value="">Select year…</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Percentage / CGPA" required error={errors.tenthPct}>
            <input type="text" placeholder="e.g. 92%" value={data.tenthPct} inputMode="decimal"
              onChange={e => set('tenthPct', e.target.value)} />
          </Field>
          <div className="field">
            <label>10th marksheet <span className="req">*</span></label>
            <FileUpload
              value={data.tenthFile}
              onChange={f => set('tenthFile', f)}
              label="Upload 10th marksheet"
              hint={`PDF, JPG or PNG · max ${fmtFileSize(MAX_FILE_BYTES)}`}
              error={errors.tenthFile}
            />
          </div>
        </div>
      </div>

      <div className="acad-card">
        <h4>Class 11 <span className="grade-badge">If completed</span></h4>
        <div className="fgrid">
          <Field label="School name">
            <input type="text" value={data.eleventhSchool} onChange={e => set('eleventhSchool', e.target.value)} />
          </Field>
          <Field label="Stream">
            <select value={data.eleventhStream} onChange={e => set('eleventhStream', e.target.value)}>
              <option value="">Select stream…</option>
              <option>Science (PCM)</option>
              <option>Science (PCB)</option>
              <option>Science (PCMB)</option>
              <option>Commerce</option>
              <option>Humanities / Arts</option>
              <option>Other</option>
            </select>
          </Field>
          <div className="field full">
            <label>11th marksheet (optional)</label>
            <FileUpload value={data.eleventhFile} onChange={f => set('eleventhFile', f)}
              label="Upload 11th marksheet" hint="Helpful if you've finished class 11" />
          </div>
        </div>
      </div>

      <div className="acad-card">
        <h4>Class 12 <span className="grade-badge">If applicable</span></h4>
        <div className="fgrid">
          <Field label="Board">
            <select value={data.twelfthBoard} onChange={e => set('twelfthBoard', e.target.value)}>
              <option value="">Select board…</option>
              <option>CBSE</option><option>ICSE / ISC</option>
              <option>State Board</option><option>IB</option>
              <option>Not yet completed</option>
            </select>
          </Field>
          <Field label="Year of passing">
            <select value={data.twelfthYear} onChange={e => set('twelfthYear', e.target.value)}>
              <option value="">Select year…</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Percentage / CGPA" error={errors.twelfthPct}>
            <input type="text" placeholder="e.g. 88%" value={data.twelfthPct} inputMode="decimal"
              onChange={e => set('twelfthPct', e.target.value)} />
          </Field>
          <div className="field">
            <label>12th marksheet</label>
            <FileUpload value={data.twelfthFile} onChange={f => set('twelfthFile', f)}
              label="Upload 12th marksheet" hint="Required if you've completed class 12" />
          </div>
        </div>
      </div>

      <div className="acad-card" style={{ marginBottom: 0 }}>
        <h4>Entrance exams <span className="grade-badge">If attempted</span></h4>
        <div className="fgrid">
          <Field label="JEE score / rank" hint="Leave blank if not attempted">
            <input type="text" value={data.jeeScore} onChange={e => set('jeeScore', e.target.value)} />
          </Field>
          <Field label="NEET score / rank">
            <input type="text" value={data.neetScore} onChange={e => set('neetScore', e.target.value)} />
          </Field>
          <Field label="CET score / rank">
            <input type="text" value={data.cetScore} onChange={e => set('cetScore', e.target.value)} />
          </Field>
        </div>
      </div>
    </div>
  );
}
