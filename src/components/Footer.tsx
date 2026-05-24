import { Icon } from '../icons';
import { CONTACT } from '../data';

export function Footer() {
  return (
    <footer className="foot foot-compact">
      <div className="shell foot-row">
        <div className="foot-brand">© {new Date().getFullYear()} Fluence International</div>
        <div className="foot-contact">
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          <span>{CONTACT.address}</span>
          <a
            className="foot-whatsapp"
            href={CONTACT.whatsappCommunity}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our WhatsApp community"
          >
            <Icon.WhatsApp size={14} /> WhatsApp community
          </a>
        </div>
      </div>
    </footer>
  );
}
