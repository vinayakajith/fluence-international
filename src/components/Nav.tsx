import { Icon, FluenceWordmark } from '../icons';
import { CONTACT } from '../data';
import type { View, Go } from '../App';

interface NavProps {
  go: Go;
  current?: View;
}

export function Nav({ go }: NavProps) {
  return (
    <header className="nav">
      <div className="shell nav-inner">
        <a className="nav-logo-link" onClick={() => go('home')} style={{ cursor: 'pointer' }}>
          <FluenceWordmark height={60} />
        </a>
        <div className="nav-right">
          <a href={CONTACT.phoneHref} className="nav-phone" aria-label="Call us">
            <Icon.Phone size={14} /> <span className="nav-phone-num">{CONTACT.phone}</span>
          </a>
          <button className="nav-cta" onClick={() => go('enquiry')}>
            Get guidance <Icon.Arrow size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
