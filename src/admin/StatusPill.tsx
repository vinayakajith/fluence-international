import { STATUS_STYLE } from '../data';
import type { Status } from '../data';

interface StatusPillProps {
  status: Status;
}

export function StatusPill({ status }: StatusPillProps) {
  const sc = STATUS_STYLE[status] ?? { c: 'var(--ink-2)', bg: 'var(--paper-2)' };
  return (
    <span className="app-pill" style={{ color: sc.c, background: sc.bg, borderColor: 'transparent' }}>
      {status}
    </span>
  );
}
