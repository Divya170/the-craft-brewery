import type { ApiErrorBody, ArtKey, ContentBlock, ContentType, GalleryItem, GalleryResponse, PageCopy, Product, ProductDetail, SiteSettings, Style } from './types';

/** Base URL for API calls. Server components may use an internal URL; the browser always uses NEXT_PUBLIC_API_URL. */
export function apiBase() {
  if (typeof window === 'undefined') return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
}

/** Turn a stored upload path (/uploads/x.jpg) into an absolute URL the browser can load. */
export function mediaUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const origin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${origin}${path}`;
}

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;
  constructor(status: number, body: ApiErrorBody | null) {
    const msg = Array.isArray(body?.message) ? body?.message.join(' ') : body?.message;
    super(msg || (status >= 500 ? 'Something went wrong on our side. Please try again.' : 'The request could not be completed.'));
    this.status = status;
    this.fieldErrors = body?.errors ?? {};
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${apiBase()}${path}`, {
      cache: 'no-store',
      ...init,
      headers: { Accept: 'application/json', ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError(0, { message: 'We couldn’t reach the brewery’s server. Check your connection and try again.' });
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new ApiError(res.status, (data as ApiErrorBody) ?? null);
  return data as T;
}

/* ---------- public site data (server components) ---------- */
export const getSettings = () => apiFetch<SiteSettings>('/settings');
export const getPageCopy = () => apiFetch<PageCopy>('/content/page-copy');
export const getContent = (type: ContentType) => apiFetch<ContentBlock[]>(`/content?type=${type}`);
export const getStyles = () => apiFetch<Style[]>('/styles');
export const getProducts = () => apiFetch<Product[]>('/products');
export const getFeaturedProducts = () => apiFetch<Product[]>('/products/featured');
export const getProduct = (slug: string) => apiFetch<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
export const getGallery = () => apiFetch<GalleryResponse>('/gallery');
export const getGalleryHome = () => apiFetch<GalleryItem[]>('/gallery/home');

/** Read a page-copy block with safe fallbacks so a missing row never crashes a page. */
export function copy(pc: PageCopy, key: string) {
  const b = pc[key];
  return {
    title: b?.title ?? '',
    body: b?.body ?? '',
    eyebrow: b?.fields?.eyebrow ?? '',
    clientNote: b?.fields?.clientNote ?? '',
    imageUrl: b?.fields?.imageUrl ?? null,
    alt: b?.fields?.alt ?? '',
    fields: b?.fields ?? {},
  };
}

/** Split a heading so the *starred* words render in the italic accent, e.g. "Good beer begins with a *passion* for the craft." */
export function emphasis(title: string): { before: string; em: string; after: string } {
  const m = title.match(/^(.*?)\*(.+?)\*(.*)$/);
  return m ? { before: m[1], em: m[2], after: m[3] } : { before: title, em: '', after: '' };
}

/** Illustrated stand-ins shipped in /public/art, shown wherever a real photo hasn't been uploaded yet. */
export const artUrl = (k: ArtKey | string | null | undefined) => `/art/${k || 'tanks'}.svg`;
export type { ArtKey };

/** "2026-12-05" → "December 5, 2026" without timezone shifts. */
export function longDate(v: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return v;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
