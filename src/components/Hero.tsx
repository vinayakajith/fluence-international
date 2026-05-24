import { useEffect, useState } from 'react';
import { Icon } from '../icons';
import { PARTNERS, PROGRAMS, ADMISSION_CYCLE } from '../data';
import type { Go } from '../App';

interface HeroProps {
  go: Go;
}

// Three urgency lines that auto-rotate inside the status card so the panel
// reads as "alive" without ever inventing a number.
const URGENCY_TICKER = [
  'Direct admission — no entrance test',
  'Partners close intake first-come, first-served',
  'Free counselling · No application fee',
  'Seats confirmed before payment',
];

export function Hero({ go }: HeroProps) {
  const partnersCount = PARTNERS.length;
  const programsCount = PROGRAMS.length - 1; // exclude "Other"

  // Counsellor desk hours — IST 9 AM – 9 PM. Mirrors a real working desk.
  const [deskOpen, setDeskOpen] = useState(true);
  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setDeskOpen(h >= 9 && h < 21);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // Rotating ticker — one message at a time, 3.6s each.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % URGENCY_TICKER.length), 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="shell hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">Direct admissions consultancy</div>
          <h1 className="display hero-title">
            Apply directly to <span className="it">top colleges.</span>
          </h1>
          <p className="hero-lede">
            A single enquiry connects you with {partnersCount} verified partner universities across Bangalore, Chennai, Coimbatore, Mangalore and Kerala. A counsellor responds within 48 hours.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => go('enquiry')}>
              Begin enquiry <Icon.Arrow size={16} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                const el = document.getElementById('partners');
                if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
              }}
            >
              View partner universities
            </button>
            <span className="hero-meta">Takes ~4 minutes</span>
          </div>
          <div className="hero-trust">
            <span><strong>{partnersCount}+</strong> partner universities</span>
            <span aria-hidden="true">·</span>
            <span><strong>{programsCount}+</strong> program streams</span>
            <span aria-hidden="true">·</span>
            <span><strong>11</strong> years guiding students</span>
          </div>
        </div>

        <aside className="hero-status anim-slide-in" aria-label={`${ADMISSION_CYCLE.year} admissions status`}>
          <div className="status-header">
            <span className="status-badge">
              <span className={`status-dot ${deskOpen ? 'on' : 'off'}`} aria-hidden="true" />
              <span>{deskOpen ? 'Counsellors online' : 'Reopens 9 AM IST'}</span>
            </span>
            <span className="status-cycle">{ADMISSION_CYCLE.year} intake</span>
          </div>

          <div className="status-hero">
            <h3 className="status-headline">
              Secure your seat <span className="status-headline-accent">before partners close intake.</span>
            </h3>
          </div>

          <div className="status-ticker" aria-live="polite">
            {URGENCY_TICKER.map((msg, i) => (
              <div
                key={i}
                className={`status-ticker-row ${i === tick ? 'on' : ''}`}
              >
                <Icon.Bolt size={13} /> {msg}
              </div>
            ))}
          </div>

          <ul className="status-checks" aria-label="What you get">
            <li>
              <span className="status-check-icon"><Icon.Check size={11}/></span>
              Counsellor response in <strong>{ADMISSION_CYCLE.responseSLA}</strong>
            </li>
            <li>
              <span className="status-check-icon"><Icon.Check size={11}/></span>
              <strong>{partnersCount} verified partners</strong>, {programsCount}+ streams
            </li>
            <li>
              <span className="status-check-icon"><Icon.Check size={11}/></span>
              No entrance test · No application fee
            </li>
          </ul>

          <button className="btn btn-primary status-cta btn-shimmer" onClick={() => go('enquiry')}>
            Apply now <Icon.Arrow size={14} />
          </button>
          <div className="status-foot">First-come, first-served</div>
        </aside>
      </div>
    </section>
  );
}
