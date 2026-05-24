export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const hrs = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  if (hrs < 1)  return 'Just now';
  if (hrs < 24) return `${Math.floor(hrs)}h ago`;
  const days = hrs / 24;
  if (days < 7) return `${Math.floor(days)}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase() ?? '').join('');
}

export function fmtFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
