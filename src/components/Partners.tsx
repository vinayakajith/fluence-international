import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../icons';
import { PARTNERS, CITIES, PROGRAMS, CITY_COLOR } from '../data';
import type { Partner, City, ProgramKey } from '../data';
import type { Go } from '../App';

interface PartnersProps {
  go: Go;
}

type CityFilter = 'All' | City;
type ProgramFilter = 'All' | ProgramKey;

// Initial visible cards before "Show more". Smaller on mobile so the page
// doesn't become a giant scroll wall.
function usePreviewLimit() {
  const get = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches ? 6 : 12;
  const [limit, setLimit] = useState<number>(get);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 720px)');
    const onChange = () => setLimit(get());
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);
  return limit;
}

export function Partners({ go }: PartnersProps) {
  const [city, setCity] = useState<CityFilter>('All');
  const [program, setProgram] = useState<ProgramFilter>('All');
  const [expanded, setExpanded] = useState(false);
  const previewLimit = usePreviewLimit();

  const filtered = useMemo<Partner[]>(() =>
    PARTNERS.filter(p => {
      if (city !== 'All' && p.city !== city) return false;
      if (program !== 'All' && !p.programs.includes(program)) return false;
      return true;
    }),
    [city, program]
  );

  const filtering = city !== 'All' || program !== 'All';
  // Filters change → always show all matches (no "show more" needed when filtering).
  const visible = (expanded || filtering) ? filtered : filtered.slice(0, previewLimit);
  const hiddenCount = filtered.length - visible.length;

  // Reset expansion when filters move so the layout doesn't get stuck.
  useEffect(() => { setExpanded(false); }, [city, program]);

  const pickPartner = (p: Partner) => go('enquiry', { university: p.name });
  const clearFilters = () => { setCity('All'); setProgram('All'); };

  return (
    <section className="partners" id="partners">
      <div className="shell">
        <div className="partners-head">
          <div>
            <div className="eyebrow">Partner universities</div>
            <h2 className="partners-title">
              Select a college to <span className="it">begin your enquiry.</span>
            </h2>
          </div>
          <div className="partners-meta">
            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'university' : 'universities'}
            {filtering && (
              <button className="filter-clear" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-label">City</div>
          <div className="chips chips-scroll">
            {(['All', ...CITIES] as CityFilter[]).map(c => (
              <button
                key={c}
                className={`chip ${city === c ? 'active' : ''}`}
                onClick={() => setCity(c)}
              >{c}</button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-label">Program</div>
          <div className="chips chips-scroll">
            {(['All', ...PROGRAMS.map(p => p.key)] as ProgramFilter[]).map(p => (
              <button
                key={p}
                className={`chip ${program === p ? 'active' : ''}`}
                onClick={() => setProgram(p)}
              >{p}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="partner-empty">
            No matches — clear a filter or pick a different program.<br />
            <button
              className="btn btn-secondary"
              style={{ marginTop: 18 }}
              onClick={() => go('enquiry', { program: 'Other' })}
            >
              Enquire about a custom course <Icon.Arrow size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="partner-grid">
              {visible.map(p => (
                <button
                  key={p.name}
                  type="button"
                  className="partner-card"
                  style={{ '--city-color': CITY_COLOR[p.city] } as React.CSSProperties}
                  onClick={() => pickPartner(p)}
                >
                  <div className="partner-card-top">
                    <span className="partner-card-loc">{p.city}</span>
                    <span className="partner-card-cta"><Icon.Arrow size={14} /></span>
                  </div>
                  <div className="partner-card-name">{p.name}</div>
                  <div className="partner-card-progs">
                    {p.programs.slice(0, 4).map(pr => (
                      <span className="prog-tag" key={pr}>{pr}</span>
                    ))}
                    {p.programs.length > 4 && (
                      <span className="prog-tag">+{p.programs.length - 4}</span>
                    )}
                  </div>
                  <div className="partner-card-foot">Start enquiry →</div>
                </button>
              ))}

              {/* Fallback CTA for users whose course / college isn't on the list. */}
              <button
                type="button"
                className="partner-card partner-card-custom"
                onClick={() => go('enquiry', { program: 'Other' })}
                aria-label="Enquire about a custom course"
              >
                <div className="partner-card-top">
                  <span className="partner-card-loc">Custom course</span>
                  <span className="partner-card-cta"><Icon.Arrow size={14} /></span>
                </div>
                <div className="partner-card-name">Don't see your course?</div>
                <p className="partner-card-custom-sub">
                  Tell us what you're applying for and our counsellor will recommend the right partner.
                </p>
                <div className="partner-card-foot">Submit custom enquiry →</div>
              </button>
            </div>

            {hiddenCount > 0 && (
              <div className="partner-expand">
                <button className="btn btn-secondary" onClick={() => setExpanded(true)}>
                  Show all {filtered.length} universities <Icon.Arrow size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
