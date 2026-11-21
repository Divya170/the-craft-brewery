import { HttpException, HttpStatus } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

/** Simple in-memory per-IP limiter (spam protection, together with each form's honeypot). */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();
  constructor(private readonly limit: () => number, private readonly message: string, private readonly windowMs = 10 * 60_000) {}

  check(ip: string) {
    const now = Date.now();
    const key = ip || 'unknown';
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit()) throw new HttpException({ statusCode: 429, message: this.message }, HttpStatus.TOO_MANY_REQUESTS);
    recent.push(now);
    this.hits.set(key, recent);
  }
}

export const fingerprintOf = (parts: unknown[]) =>
  createHash('sha256').update(parts.map((p) => String(p ?? '').toLowerCase().replace(/\s+/g, ' ').trim()).join('|')).digest('hex');

/** CK-yymmdd-XXXX style reference; the caller checks uniqueness. */
export const makeReference = (prefix: string) => `${prefix}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase().slice(0, 4)}`;

/** CSV with a spreadsheet formula-injection guard. */
export function toCsv<T>(rows: T[], cols: (keyof T)[]) {
  const esc = (v: unknown) => {
    let s = v instanceof Date ? v.toISOString() : v == null ? '' : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}
