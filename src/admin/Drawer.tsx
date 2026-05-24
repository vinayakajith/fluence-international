import { useEffect } from 'react';
import { Icon } from '../icons';
import { STATUS_FLOW, ALL_STATUSES, MEDICAL_PROGRAMS } from '../data';
import type { Status } from '../data';
import { fmtDate, initials, fmtFileSize } from '../utils/format';
import { StatusPill } from './StatusPill';
import type { Application } from './types';
import type { FileMeta } from '../enquiry/types';
import { supabase } from '../lib/supabase';

function nextStatus(current: Status): Status | null {
  // STATUS_FLOW is the active funnel: Lead → Contacted → Documents verified
  // → Admitted. Statuses outside it (Lost) have no automatic next step.
  const i = STATUS_FLOW.indexOf(current);
  if (i < 0 || i >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[i + 1] ?? null;
}

interface DrawerProps {
  app: Application | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
}

function FileBlock({ f }: { f: FileMeta | null }) {
  if (!f) return <span style={{ color: 'var(--muted-2)', fontStyle: 'italic', fontSize: 13 }}>Not uploaded</span>;

  const download = async () => {
    if (!f.path) return;
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(f.path, 3600);
    if (!error && data) window.open(data.signedUrl, '_blank');
  };

  return (
    <span className="file-pill">
      <Icon.File size={16} />
      <span className="name">{f.name}</span>
      <span className="meta">{fmtFileSize(f.size)}</span>
      {f.path && (
        <button onClick={download} className="file-download-btn" title="Download file">↓</button>
      )}
    </span>
  );
}

export function Drawer({ app, onClose, onUpdateStatus }: DrawerProps) {
  useEffect(() => {
    if (!app) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [app, onClose]);

  if (!app) {
    return (
      <>
        <div className="drawer-mask" />
        <div className="drawer" aria-hidden="true" />
      </>
    );
  }

  const isOrange = app.preferredProgram ? MEDICAL_PROGRAMS.has(app.preferredProgram) : false;
  const advance = nextStatus(app.status);

  return (
    <>
      <div className="drawer-mask open" onClick={onClose} />
      <div className="drawer open" role="dialog" aria-label={`Application ${app.id}`}>
        <div className="drawer-head">
          <span className={`app-avatar ${isOrange ? 'o' : ''}`}>{initials(app.fullName)}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2>{app.fullName}</h2>
            <div className="sub">{app.id} · Submitted {fmtDate(app.submittedAt)}</div>
          </div>
          <StatusPill status={app.status} />
          <button className="drawer-close" onClick={onClose} aria-label="Close"><Icon.X size={16} /></button>
        </div>

        <div className="drawer-body">

          <div className="review-grp">
            <div className="review-grp-head"><h4>Contact</h4></div>
            <div className="review-grid">
              <div className="review-item"><span className="k">Email</span><span className="v"><a href={`mailto:${app.email}`}>{app.email}</a></span></div>
              <div className="review-item"><span className="k">Phone</span><span className="v"><a href={`tel:${app.phone}`}>{app.phone}</a></span></div>
              <div className="review-item"><span className="k">Date of birth</span><span className="v">{app.dob || '—'}</span></div>
              <div className="review-item"><span className="k">City, State</span><span className="v">{[app.city, app.state].filter(Boolean).join(', ') || '—'}</span></div>
            </div>
          </div>

          <div className="review-grp">
            <div className="review-grp-head"><h4>Academic record</h4></div>
            <div className="review-grid">
              <div className="review-item"><span className="k">Class 10</span><span className="v">{[app.tenthBoard, app.tenthYear, app.tenthPct].filter(Boolean).join(' · ') || '—'}</span></div>
              <div className="review-item"><span className="k">10th marksheet</span><FileBlock f={app.tenthFile} /></div>
              <div className="review-item"><span className="k">Class 11 stream</span><span className="v">{[app.eleventhStream, app.eleventhSchool].filter(Boolean).join(' · ') || '—'}</span></div>
              <div className="review-item"><span className="k">11th marksheet</span><FileBlock f={app.eleventhFile} /></div>
              <div className="review-item"><span className="k">Class 12</span><span className="v">{[app.twelfthBoard, app.twelfthYear, app.twelfthPct].filter(Boolean).join(' · ') || '—'}</span></div>
              <div className="review-item"><span className="k">12th marksheet</span><FileBlock f={app.twelfthFile} /></div>
              {app.studyLevel === 'PG' && (
                <div className="review-item"><span className="k">UG degree cert</span><FileBlock f={app.ugFile} /></div>
              )}
              <div className="review-item" style={{ gridColumn: '1 / -1' }}>
                <span className="k">Entrance exams</span>
                <span className="v">{[
                  app.jeeScore  && `JEE: ${app.jeeScore}`,
                  app.neetScore && `NEET: ${app.neetScore}`,
                  app.cetScore  && `CET: ${app.cetScore}`,
                ].filter(Boolean).join(' · ') || '—'}</span>
              </div>
            </div>
          </div>

          <div className="review-grp">
            <div className="review-grp-head"><h4>Program preference</h4></div>
            <div className="review-grid">
              <div className="review-item">
                <span className="k">Program</span>
                <span className="v">
                  {app.preferredProgram === 'Other'
                    ? <>Other — <em>{app.otherProgram || '(not specified)'}</em></>
                    : (app.preferredProgram || '—')}
                </span>
              </div>
              <div className="review-item"><span className="k">Preferred city</span><span className="v">{app.preferredCity || 'Any'}</span></div>
              <div className="review-item" style={{ gridColumn: '1 / -1' }}>
                <span className="k">Preferred university</span>
                <span className="v">{app.preferredUniversity || 'Recommend best fit'}</span>
              </div>
              <div className="review-item" style={{ gridColumn: '1 / -1' }}>
                <span className="k">Goals</span>
                <span className="v" style={{ lineHeight: 1.5 }}>{app.goals || '—'}</span>
              </div>
            </div>
          </div>

          <div className="review-grp">
            <div className="review-grp-head"><h4>Status</h4></div>
            <div className="status-picker" role="radiogroup" aria-label="Application status">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  className={`status-opt ${app.status === s ? 'active' : ''} ${s === 'Lost' ? 'status-opt-lost' : ''}`}
                  onClick={() => onUpdateStatus(app.id, s)}
                  role="radio"
                  aria-checked={app.status === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="drawer-foot">
          <a className="btn btn-secondary" href={`tel:${app.phone}`}><Icon.Phone size={14} /> Call</a>
          <a className="btn btn-secondary" href={`mailto:${app.email}`}><Icon.Mail size={14} /> Email</a>
          {advance ? (
            <button className="btn btn-primary" onClick={() => onUpdateStatus(app.id, advance)}>
              Mark as {advance.toLowerCase()} <Icon.Arrow size={14} />
            </button>
          ) : (
            <button className="btn btn-primary" disabled>Application complete</button>
          )}
        </div>
      </div>
    </>
  );
}
