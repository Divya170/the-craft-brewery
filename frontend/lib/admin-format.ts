/** Date/time display helpers for the admin. Dates are YYYY-MM-DD calendar dates, so they're parsed locally and never shifted by timezone. */
export function formatDate(d: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString('en-US', opts);
}

/** "19:30" → "7:30 PM" */
export function formatTime(t: string) {
  const m = /^(\d{2}):(\d{2})$/.exec(t);
  if (!m) return t;
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}

export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`;

export const formatReceived = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
