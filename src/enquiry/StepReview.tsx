import { Icon } from '../icons';
import { fmtFileSize } from '../utils/format';
import type { FormData } from './types';

interface StepReviewProps {
  data: FormData;
  setStep: (i: number) => void;
}

function valueOrEmpty(val: string | null | undefined) {
  return val ? <span className="v">{val}</span> : <span className="v empty">Not provided</span>;
}

function fileBlock(f: File | null) {
  if (!f) return <span className="v empty">No file</span>;
  return (
    <span className="v" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icon.File size={14} /> {f.name} <span style={{ color: 'var(--muted)', fontSize: 12 }}>· {fmtFileSize(f.size)}</span>
    </span>
  );
}

export function StepReview({ data, setStep }: StepReviewProps) {
  return (
    <div>
      <div className="wiz-step-head">
        <div className="eyebrow">Step 4 of 4 · Almost done</div>
        <h2>Review &amp; <span className="it">submit.</span></h2>
        <div className="help">Take a quick look — you can edit any section before sending.</div>
      </div>

      <div className="review-grp">
        <div className="review-grp-head">
          <h4>Personal details</h4>
          <button className="review-edit" onClick={() => setStep(0)}>Edit</button>
        </div>
        <div className="review-grid">
          <div className="review-item"><span className="k">Full name</span>{valueOrEmpty(data.fullName)}</div>
          <div className="review-item"><span className="k">Date of birth</span>{valueOrEmpty(data.dob)}</div>
          <div className="review-item"><span className="k">Email</span>{valueOrEmpty(data.email)}</div>
          <div className="review-item"><span className="k">Phone</span>{valueOrEmpty(data.phone)}</div>
          <div className="review-item" style={{ gridColumn: '1 / -1' }}>
            <span className="k">City, State</span>
            {valueOrEmpty([data.city, data.state].filter(Boolean).join(', '))}
          </div>
        </div>
      </div>

      <div className="review-grp">
        <div className="review-grp-head">
          <h4>Academic record</h4>
          <button className="review-edit" onClick={() => setStep(1)}>Edit</button>
        </div>
        <div className="review-grid">
          <div className="review-item"><span className="k">Class 10</span>{valueOrEmpty([data.tenthBoard, data.tenthYear, data.tenthPct].filter(Boolean).join(' · '))}</div>
          <div className="review-item"><span className="k">10th marksheet</span>{fileBlock(data.tenthFile)}</div>
          <div className="review-item"><span className="k">Class 11</span>{valueOrEmpty([data.eleventhStream, data.eleventhSchool].filter(Boolean).join(' · '))}</div>
          <div className="review-item"><span className="k">11th marksheet</span>{fileBlock(data.eleventhFile)}</div>
          <div className="review-item"><span className="k">Class 12</span>{valueOrEmpty([data.twelfthBoard, data.twelfthYear, data.twelfthPct].filter(Boolean).join(' · '))}</div>
          <div className="review-item"><span className="k">12th marksheet</span>{fileBlock(data.twelfthFile)}</div>
          <div className="review-item"><span className="k">JEE / NEET / CET</span>{valueOrEmpty([
            data.jeeScore  && `JEE ${data.jeeScore}`,
            data.neetScore && `NEET ${data.neetScore}`,
            data.cetScore  && `CET ${data.cetScore}`,
          ].filter(Boolean).join(' · '))}</div>
        </div>
      </div>

      <div className="review-grp">
        <div className="review-grp-head">
          <h4>Program preference</h4>
          <button className="review-edit" onClick={() => setStep(2)}>Edit</button>
        </div>
        <div className="review-grid">
          <div className="review-item">
            <span className="k">Program</span>
            {valueOrEmpty(
              data.preferredProgram === 'Other'
                ? `Other — ${data.otherProgram || '(not specified)'}`
                : data.preferredProgram
            )}
          </div>
          <div className="review-item"><span className="k">Preferred city</span>{valueOrEmpty(data.preferredCity || 'Any')}</div>
          <div className="review-item" style={{ gridColumn: '1 / -1' }}>
            <span className="k">Preferred university</span>{valueOrEmpty(data.preferredUniversity || 'Recommend best fit')}
          </div>
          <div className="review-item" style={{ gridColumn: '1 / -1' }}>
            <span className="k">Goals / career path</span>{valueOrEmpty(data.goals)}
          </div>
        </div>
      </div>

      <div className="legal-note">
        By submitting, you agree to be contacted by a Fluence counsellor about your application. We don't share your information with third parties outside the verified partner you've selected.
      </div>
    </div>
  );
}
