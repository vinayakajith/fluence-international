import { Icon } from '../icons';
import { CONTACT } from '../data';

interface SuccessViewProps {
  id: string;
}

export function SuccessView({ id }: SuccessViewProps) {
  return (
    <div className="success-card">
      <span className="checkmark"><Icon.Check size={32} /></span>
      <h2>Application <span className="it">received.</span></h2>
      <p>
        Thank you. Your enquiry has been logged and a counsellor will be in touch within 48 hours on your registered phone and email.
      </p>
      <div className="success-id">Reference · {id}</div>

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
