import { useEffect, useState } from 'react';
import { Icon } from '../icons';
import { PARTNERS, PROGRAMS, ADMISSION_CYCLE } from '../data';
import type { Go } from '../App';

interface HeroProps {
  go: Go;
}

const URGENCY_TICKER = [
  'Direct admission — no entrance test',
  'Partners close intake first-come, first-served',
  'Free counselling · No application fee',
  'Seats confirmed before payment',
  'Counsellors active across 5 cities',
];

const CARD_INTERVAL = 7000;

export function Hero({ go }: HeroProps) {
  const partnersCount = PARTNERS.length;
  const programsCount = PROGRAMS.length - 1;

  const [deskOpen, setDeskOpen] = useState(true);
  useEffect(() => {
    const update = () => { const h = new Date().getHours(); setDeskOpen(h >= 9 && h < 21); };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % URGENCY_TICKER.length), 3600);
    return () => clearInterval(id);
  }, []);

  // 0 = urgency card, 1 = campus visit card
  const [cardIdx, setCardIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCardIdx(i => (i + 1) % 2), CARD_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="shell hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">UGC-approved partner colleges</div>
          <h1 className="display hero-title">
            Admission guidance for B.Tech, MBBS, Nursing <span className="it">&amp; more.</span>
          </h1>
          <p className="hero-lede">
            One enquiry connects you with {partnersCount} verified partner colleges across Bangalore, Chennai, Coimbatore, Mangalore and Kerala — direct admission, no entrance test, no donation.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => go('enquiry')}>
              Get admission guidance <Icon.Arrow size={16} />
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
            <span><strong>{partnersCount}+</strong> verified colleges</span>
            <span aria-hidden="true">·</span>
            <span><strong>{programsCount}+</strong> program streams</span>
            <span aria-hidden="true">·</span>
            <span><strong>11</strong> years · free counselling</span>
          </div>
        </div>

        {/* Right column — single slot, cards crossfade every 7 s */}
        <div className="hero-card-col anim-slide-in">

          <div className="hero-card-switcher">

            {/* ── Card 0: Urgency ── */}
            <aside
              className={`hero-status card-slot ${cardIdx === 0 ? 'card-on' : 'card-off'}`}
              aria-label={`${ADMISSION_CYCLE.year} admissions status`}
              aria-hidden={cardIdx !== 0}
            >
              <div className="status-header">
                <span className="status-badge">
                  <span className={`status-dot ${deskOpen ? 'on' : 'off'}`} aria-hidden="true" />
                  <span>{deskOpen ? 'Counsellors online' : 'Reopens 9 AM IST'}</span>
                </span>
                <span className="status-cycle">{ADMISSION_CYCLE.year} intake</span>
              </div>

              <div className="status-hero">
                <h3 className="status-headline">
                  Seats are filling.<br />
                  <span className="status-headline-accent">Secure yours before intake closes.</span>
                </h3>
              </div>

              <div className="status-ticker" aria-live="polite">
                {URGENCY_TICKER.map((msg, i) => (
                  <div key={i} className={`status-ticker-row ${i === tick ? 'on' : ''}`}>
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

              <div className="status-fill-bar" aria-hidden="true">
                <div className="status-fill-track">
                  <div className="status-fill-progress" />
                </div>
                <span className="status-fill-label">Seats filling fast</span>
              </div>

              <button className="btn btn-primary status-cta btn-shimmer" onClick={() => go('enquiry')}>
                Apply now <Icon.Arrow size={14} />
              </button>
              <div className="status-foot">First-come, first-served · {ADMISSION_CYCLE.year}</div>
            </aside>

            {/* ── Card 1: Campus visit ── */}
            <div
              className={`campus-card card-slot ${cardIdx === 1 ? 'card-on' : 'card-off'}`}
              aria-hidden={cardIdx !== 1}
            >
              <div className="campus-glow" aria-hidden="true" />
              <div className="campus-tag">
                <Icon.Calendar size={11} /> Free offer
              </div>
              <h3 className="campus-title">
                See the campus<br />
                <span className="campus-title-accent">before you decide.</span>
              </h3>
              <p className="campus-desc">
                Walk the grounds. Meet a real counsellor. Ask every question — zero pressure, zero fee.
              </p>
              <ul className="campus-perks">
                <li><Icon.Check size={11} /> Guided campus tour</li>
                <li><Icon.Check size={11} /> One-on-one counsellor session</li>
                <li><Icon.Check size={11} /> No commitment required</li>
              </ul>
              <button className="campus-cta btn-shimmer" onClick={() => go('enquiry')}>
                Book your free visit <Icon.Arrow size={14} />
              </button>
              <div className="campus-foot">Slots fill quickly — book early</div>
            </div>

          </div>

          {/* Dot indicators */}
          <div className="card-dots" role="tablist" aria-label="Switch card">
            {[0, 1].map(i => (
              <button
                key={i}
                role="tab"
                aria-selected={cardIdx === i}
                className={`card-dot ${cardIdx === i ? 'on' : ''}`}
                onClick={() => setCardIdx(i)}
                aria-label={i === 0 ? 'Admissions status' : 'Campus visit'}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
