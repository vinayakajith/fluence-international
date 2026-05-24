import { MEDICAL_PROGRAMS } from '../data';
import { fmtDate, initials } from '../utils/format';
import { StatusPill } from './StatusPill';
import type { Application } from './types';

interface ApplicantRowProps {
  app: Application;
  onClick: () => void;
}

export function ApplicantRow({ app, onClick }: ApplicantRowProps) {
  const isOrange = app.preferredProgram ? MEDICAL_PROGRAMS.has(app.preferredProgram) : false;
  return (
    <div
      className="app-row"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="app-name">
        <span className={`app-avatar ${isOrange ? 'o' : ''}`}>{initials(app.fullName)}</span>
        <div className="app-meta-text">
          <strong>{app.fullName}</strong>
          <span>{app.email}</span>
        </div>
      </div>
      <div className="app-cell">
        <span className="truncate">
          {app.preferredProgram === 'Other'
            ? <>Other <span style={{ color: 'var(--muted)' }}>· {app.otherProgram || 'unspecified'}</span></>
            : (app.preferredProgram || '—')}
        </span>
        <span className="small">{app.preferredCity || 'Any city'}</span>
      </div>
      <div className="app-cell">
        <span className="truncate">{app.preferredUniversity || 'Recommend best fit'}</span>
      </div>
      <div className="app-cell" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {app.twelfthPct || app.tenthPct || '—'}
        <span className="small">{app.twelfthBoard || app.tenthBoard || ''}</span>
      </div>
      <div className="app-cell">
        <StatusPill status={app.status} />
        <span className="small" style={{ marginTop: 3 }}>{fmtDate(app.submittedAt)}</span>
      </div>
      <div className="app-cell" style={{ color: 'var(--muted)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
        {app.id}
      </div>
    </div>
  );
}
