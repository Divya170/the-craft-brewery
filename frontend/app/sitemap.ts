import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ['', '/products', '/our-story', '/brewing-process', '/visit-us', '/gallery'].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now }));
  let products: { slug: string }[] = [];
  try { products = await getProducts(); } catch { /* API down: static routes only */ }
  return [...pages, ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: now }))];
}
