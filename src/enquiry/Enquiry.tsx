import { useCallback, useMemo, useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Icon } from '../icons';
import { PARTNERS } from '../data';
import type { ProgramKey, Status } from '../data';
import { BLANK_FORM, STEPS } from './types';
import type { FormData } from './types';
import { validateStep, type Errors } from '../utils/validation';
import { insertApplication, updateApplicationFull, uploadDocuments, updateFileMetas } from '../utils/storage';
import { StepPersonal } from './StepPersonal';
import { StepAcademic } from './StepAcademic';
import { StepProgram } from './StepProgram';
import { StepReview } from './StepReview';
import { SuccessView } from './SuccessView';
import type { Application } from '../admin/types';
import type { Go } from '../App';

interface EnquiryProps {
  go: Go;
  preselectUniversity: string;
  preselectProgram: ProgramKey | '';
}

function newId(): string {
  return 'FL-' + Date.now().toString(36).toUpperCase().slice(-6);
}

function toApplication(id: string, data: FormData, status: Status, submittedAt: string): Application {
  return {
    id,
    submittedAt,
    status,
    studyLevel: data.studyLevel || 'UG',
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    dob: data.dob,
    city: data.city,
    state: data.state,
    tenthBoard: data.tenthBoard,
    tenthYear: data.tenthYear,
    tenthPct: data.tenthPct,
    tenthFile: null, // files are uploaded separately on final submit
    eleventhSchool: data.eleventhSchool,
    eleventhStream: data.eleventhStream,
    eleventhFile: null,
    twelfthBoard: data.twelfthBoard,
    twelfthYear: data.twelfthYear,
    twelfthPct: data.twelfthPct,
    twelfthFile: null,
    ugFile: null,
    jeeScore: data.jeeScore,
    neetScore: data.neetScore,
    cetScore: data.cetScore,
    preferredProgram: data.preferredProgram,
    otherProgram: data.preferredProgram === 'Other' ? data.otherProgram.trim() : undefined,
    preferredCity: data.preferredCity,
    preferredUniversity: data.preferredUniversity,
    goals: data.goals,
  };
}

export function Enquiry({ go, preselectUniversity, preselectProgram }: EnquiryProps) {
  const initial: FormData = useMemo(() => {
    if (preselectUniversity) {
      const p = PARTNERS.find(x => x.name === preselectUniversity);
      if (p) {
        return {
          ...BLANK_FORM,
          preferredUniversity: p.name,
          preferredCity: p.city,
          preferredProgram: p.programs[0] ?? '',
        };
      }
    }
    if (preselectProgram) {
      return { ...BLANK_FORM, preferredProgram: preselectProgram };
    }
    return BLANK_FORM;
  }, [preselectUniversity, preselectProgram]);

  const [step, setStep]           = useState(0);
  const [data, setData]           = useState<FormData>(initial);
  const [honeypot, setHoneypot]   = useState('');

  const [errors, setErrors]           = useState<Errors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  // Partial lead capture — set after Step 1 is completed
  const [partialId, setPartialId]     = useState<string | null>(null);

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData(d => ({ ...d, [key]: value }));
    setErrors(e => {
      if (!e[key]) return e;
      const rest = { ...e };
      delete rest[key];
      return rest;
    });
  }, []);

  const goToStep = (i: number) => {
    setStep(i);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      requestAnimationFrame(() => {
        const el = document.querySelector('.has-error, .upload.err');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    // Fire-and-forget partial lead capture the first time Step 1 is completed
    if (step === 0 && !partialId) {
      const id = newId();
      setPartialId(id);
      insertApplication(toApplication(id, data, 'Lead', new Date().toISOString()))
        .catch(err => console.warn('Partial lead save failed:', err));
    }
    if (step < STEPS.length - 1) goToStep(step + 1);
  };

  const prev = () => {
    if (step > 0) goToStep(step - 1);
  };

  const submit = async () => {
    if (submitting) return;
    if (honeypot) return; // bot filled the hidden field
    for (let i = 0; i <= 2; i++) {
      const e = validateStep(i, data);
      if (Object.keys(e).length > 0) {
        setStep(i);
        setErrors(e);
        return;
      }
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const id        = partialId ?? newId();
      const createdAt = new Date().toISOString();

      if (partialId) {
        await updateApplicationFull(id, toApplication(id, data, 'Lead', createdAt));
      } else {
        await insertApplication(toApplication(id, data, 'Lead', createdAt));
      }

      // Upload files — non-fatal.
      try {
        const fileMetas = await uploadDocuments(id, data);
        await updateFileMetas(id, fileMetas);
      } catch (uploadErr) {
        const msg = uploadErr instanceof Error ? uploadErr.message : JSON.stringify(uploadErr);
        console.warn('File upload/save failed:', msg);
        setUploadWarning(msg);
      }

      setSubmittedId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      const msg =
        err instanceof Error ? err.message :
        (err && typeof err === 'object' && 'message' in err) ? String((err as { message: unknown }).message) :
        JSON.stringify(err);
      setSubmitError(msg);
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="page">
        <Nav go={go} current="enquiry" />
        <main className="wiz-shell">
          <div className="shell" style={{ maxWidth: 760 }}>
            <SuccessView id={submittedId} uploadWarning={uploadWarning} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pct         = (step / (STEPS.length - 1)) * 100;
  const previewedUni = data.preferredUniversity;

  return (
    <div className="page">
      <Nav go={go} current="enquiry" />
      <section className="enquiry-header">
        <div className="shell">
          <a className="enquiry-back" onClick={() => go('home')} style={{ cursor: 'pointer' }}>
            <Icon.ArrowLeft size={14} /> Back to partner universities
          </a>
          <div className="eyebrow">Direct admission enquiry</div>
          <h1 className="enquiry-h1">Submit your <span className="it">application.</span></h1>
          <p className="enquiry-sub">Four short steps. A counsellor will call within 2–48 hours.</p>
          {previewedUni && (
            <div className="preselect-banner">
              <span className="preselect-dot" />
              <div className="preselect-text">
                <span className="preselect-label">Applying to</span>
                <strong>{previewedUni}</strong>
              </div>
              <button
                type="button"
                className="preselect-clear"
                onClick={() => set('preferredUniversity', '')}
                aria-label="Clear selected college"
              >Change</button>
            </div>
          )}
        </div>
      </section>
      <main className="wiz-shell">
        <div className="shell">

          <div className="wiz-progress-bar" role="progressbar"
            aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
            <ol className="wiz-progress-steps">
              {STEPS.map((s, i) => {
                const state = i < step ? 'done' : i === step ? 'active' : 'todo';
                return (
                  <li key={s.key}
                    className={`wiz-progress-step ${state}`}
                    onClick={() => i < step && goToStep(i)}
                    style={{ cursor: i < step ? 'pointer' : 'default' }}>
                    <span className="wpx-dot">{i < step ? <Icon.Check size={11} /> : i + 1}</span>
                    <span className="wpx-label">{s.title}</span>
                  </li>
                );
              })}
            </ol>
            <div className="wiz-progress-track">
              <div className="wiz-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="wiz-card">
            {/* Honeypot — hidden from humans, bots fill it in */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="hp_website">Website</label>
              <input id="hp_website" type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            {step === 0 && <StepPersonal data={data} set={set} errors={errors} />}
            {step === 1 && <StepAcademic data={data} set={set} errors={errors} />}
            {step === 2 && <StepProgram  data={data} set={set} errors={errors} />}
            {step === 3 && <StepReview   data={data} setStep={goToStep} />}

            <div className="wiz-foot">
              <div>
                {step > 0
                  ? <button className="btn btn-ghost" onClick={prev} disabled={submitting}>
                      <Icon.ArrowLeft size={14} /> Previous
                    </button>
                  : <span className="meta">Step {step + 1} of {STEPS.length}</span>
                }
              </div>
              <div className="wiz-foot-right">
                <span className="meta">Step {step + 1} of {STEPS.length}</span>
                {step < STEPS.length - 1
                  ? <button className="btn btn-primary" onClick={next}>
                      Continue <Icon.Arrow size={14} />
                    </button>
                  : <button className="btn btn-teal btn-lg" onClick={submit} disabled={submitting}>
                      {submitting ? 'Submitting…' : <>Submit enquiry <Icon.Arrow size={14} /></>}
                    </button>
                }
              </div>
            </div>
            {submitError && (
              <div className="submit-error">
                <strong>Submission failed:</strong> {submitError}
              </div>
            )}
            {uploadWarning && (
              <div className="submit-warning">
                <strong>Note:</strong> Your application was saved, but document uploads failed: {uploadWarning}. Please contact us to send your documents directly.
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
