import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon, FluenceWordmark } from '../icons';
import { ALL_STATUSES } from '../data';
import type { Status } from '../data';
import { listApplications, updateApplicationStatus } from '../utils/storage';
import { ApplicantRow } from './ApplicantRow';
import { Drawer } from './Drawer';
import type { Application } from './types';
import type { Go } from '../App';
import { useAuth } from '../lib/auth';
import { LoginPage } from './LoginPage';

const PAGE_SIZE = 20;

interface AdminStatProps {
  k: string;
  v: string;
  delta?: string;
}

function AdminStat({ k, v, delta }: AdminStatProps) {
  return (
    <div className="admin-stat">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      {delta && <div className="delta">{delta}</div>}
    </div>
  );
}

const STATUS_FILTERS: ReadonlyArray<'All' | Status> = ['All', ...ALL_STATUSES];

interface AdminProps {
  go: Go;
}

// Inner component — only rendered when authenticated, so hooks are unconditional.
function AdminDashboard({ go }: AdminProps) {
  const { session, signOut } = useAuth();

  const [apps, setApps]               = useState<Application[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [q, setQ]                     = useState('');
  const [status, setStatus]           = useState<'All' | Status>('All');
  const [activeId, setActiveId]       = useState<string | null>(null);
  const [pageLimit, setPageLimit]     = useState(PAGE_SIZE);

  useEffect(() => {
    listApplications()
      .then(data => { setApps(data); setDataLoading(false); })
      .catch(() => setDataLoading(false));
  }, []);

  const active      = useMemo(() => activeId ? apps.find(a => a.id === activeId) ?? null : null, [apps, activeId]);
  const closeDrawer = useCallback(() => setActiveId(null), []);

  const updateStatus = useCallback((id: string, newStatus: Status) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    updateApplicationStatus(id, newStatus).catch(err => console.error('Status update failed', err));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return apps.filter(a => {
      if (status !== 'All' && a.status !== status) return false;
      if (needle) {
        const hay = `${a.fullName} ${a.email} ${a.phone} ${a.preferredProgram} ${a.preferredUniversity ?? ''} ${a.city} ${a.id}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [apps, q, status]);

  useEffect(() => { setPageLimit(PAGE_SIZE); }, [q, status]);

  const visible   = filtered.slice(0, pageLimit);
  const remaining = Math.max(0, filtered.length - visible.length);

  const stats = useMemo(() => {
    const byProgram: Record<string, number> = {};
    let leadCount = 0, admittedCount = 0, lostCount = 0;
    for (const a of apps) {
      if (a.preferredProgram) byProgram[a.preferredProgram] = (byProgram[a.preferredProgram] || 0) + 1;
      if (a.status === 'Lead')     leadCount++;
      if (a.status === 'Admitted') admittedCount++;
      if (a.status === 'Lost')     lostCount++;
    }
    const top = Object.entries(byProgram).sort((x, y) => y[1] - x[1])[0];
    return { leadCount, admittedCount, lostCount, topProgram: top };
  }, [apps]);

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <FluenceWordmark height={44} />
        </div>
        <div className="admin-side-links">
          <div className="sectitle">Admissions</div>
          <a className="active">
            <Icon.List size={15} /> Applicants
            <span className="count-pill">{apps.length}</span>
          </a>
          <div className="sectitle" style={{ marginTop: 18 }}>Site</div>
          <a onClick={() => go('home')}><Icon.Home size={15} /> Public site</a>
          <a onClick={() => go('enquiry')}><Icon.Arrow size={15} /> Enquiry form</a>
        </div>
        <div className="footer">
          <div style={{ marginBottom: 8 }}>
            <div>Signed in as Admin</div>
            <span style={{ color: 'var(--ink-2)', wordBreak: 'break-all' }}>{session?.user.email}</span>
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 13 }} onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-head">
          <div>
            <h1>Applicants</h1>
            <div className="sub">Direct admission enquiries from the public site</div>
          </div>
          <div className="sub">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>

        <div className="admin-stats">
          <AdminStat k="Total"    v={String(apps.length)}         delta="All time" />
          <AdminStat k="Leads"    v={String(stats.leadCount)}     delta="Awaiting first contact" />
          <AdminStat k="Admitted" v={String(stats.admittedCount)} delta="Confirmed placements" />
          <AdminStat k="Lost"     v={String(stats.lostCount)}     delta="Did not convert" />
        </div>

        <div className="admin-toolbar">
          <div className="search-wrap">
            <Icon.Search />
            <input
              placeholder="Search by name, email, phone, university, ID…"
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Search applicants"
            />
            {q && (
              <button className="search-clear" onClick={() => setQ('')} aria-label="Clear search">
                <Icon.X size={14} />
              </button>
            )}
          </div>
          <div className="tb-filters">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                className={`tb-filter ${status === s ? 'active' : ''}`}
                onClick={() => setStatus(s)}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="applicants">
          <div className="app-row head">
            <div>Applicant</div>
            <div>Program</div>
            <div>Preferred university</div>
            <div>Latest %</div>
            <div>Status</div>
            <div>Ref</div>
          </div>

          {dataLoading && (
            <div className="app-empty"><div className="ttl">Loading applicants…</div></div>
          )}

          {!dataLoading && filtered.length === 0 && (
            <div className="app-empty">
              <div className="ttl">No applicants match</div>
              <div>Try clearing your filters or search query.</div>
            </div>
          )}

          {visible.map(a => (
            <ApplicantRow key={a.id} app={a} onClick={() => setActiveId(a.id)} />
          ))}
        </div>

        {remaining > 0 && (
          <div className="admin-loadmore">
            <button className="btn btn-secondary" onClick={() => setPageLimit(p => p + PAGE_SIZE)}>
              Load {Math.min(PAGE_SIZE, remaining)} more · {remaining} hidden
            </button>
          </div>
        )}

        <div className="admin-footnote">
          <span>Showing {visible.length} of {filtered.length} applicants</span>
          <span className="hide-mobile">Click any row to view full file →</span>
        </div>
      </main>

      <Drawer app={active} onClose={closeDrawer} onUpdateStatus={updateStatus} />
    </div>
  );
}

// Outer shell handles auth state before rendering the dashboard.
export function Admin({ go }: AdminProps) {
  const { session, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="login-shell">
        <div className="login-card" style={{ alignItems: 'center' }}>
          <FluenceWordmark height={44} />
          <p style={{ color: 'var(--ink-2)', marginTop: 16 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPage />;

  return <AdminDashboard go={go} />;
}
