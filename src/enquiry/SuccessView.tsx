import { Icon } from '../icons';
import { CONTACT } from '../data';

interface SuccessViewProps {
  id: string;
  uploadWarning?: string | null;
}

const NEXT_STEPS = [
  { label: 'Counsellor reviews your application', timing: 'Within 2 hours' },
  { label: 'You receive a call on your mobile', timing: 'Within 2–48 hours' },
  { label: 'Counsellor shortlists matching colleges', timing: 'Same call' },
  { label: 'Admission guidance & seat confirmation', timing: 'Within 1–3 days' },
];

export function SuccessView({ id, uploadWarning }: SuccessViewProps) {
  return (
    <div className="success-card">
      <span className="checkmark"><Icon.Check size={32} /></span>
      <h2>Application <span className="it">received.</span></h2>
      <p>
        Your enquiry is logged. A counsellor will call you within 2–48 hours on your registered mobile number.
      </p>
      <div className="success-id">Reference · {id}</div>

      <div className="success-next">
        <div className="success-next-title">What happens next</div>
        <ol className="success-timeline">
          {NEXT_STEPS.map((s, i) => (
            <li key={i} className="success-tl-item">
              <span className="success-tl-dot">{i + 1}</span>
              <div className="success-tl-body">
                <span className="success-tl-label">{s.label}</span>
                <span className="success-tl-timing">{s.timing}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {uploadWarning && (
        <div className="submit-warning" style={{ textAlign: 'left', marginTop: 16 }}>
          <strong>Documents not uploaded:</strong> {uploadWarning}<br />
          Please WhatsApp or email your marksheets directly to us.
        </div>
      )}

      <a
        className="whatsapp-cta"
        href={CONTACT.whatsappCommunity}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon.WhatsApp size={22} />
        <div className="whatsapp-cta-text">
          <strong>Join our WhatsApp community</strong>
          <span>Stay updated on admissions, deadlines and counsellor announcements.</span>
        </div>
        <Icon.Arrow size={16} />
      </a>

      <div className="success-actions">
        <a className="btn btn-primary" href={CONTACT.phoneHref}><Icon.Phone size={14} /> Call a counsellor</a>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>Submit another enquiry</button>
      </div>
    </div>
  );
}
