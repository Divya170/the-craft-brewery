'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ErrorPanel } from '@/components/admin/ui';
import { adminFetch } from '@/lib/admin-api';
import { formatReceived } from '@/lib/admin-format';
import type { ContentBlock, Inquiry, SiteSettings } from '@/lib/types';

interface InqStats { new: number; responded: number; archived: number; total: number }
interface ProductCounts { total: number; samples: number; published: number; noSpecs: number; noPhoto: number }
interface GalleryRow { id: number; imageUrl: string | null; published: boolean }
const PHOTO_TYPES = ['hero_slide', 'story_chapter', 'brand_value', 'process_stage', 'ingredient'];

function Item({ done, href, children }: { done: boolean; href: string; children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span aria-hidden="true" style={{ flex: '0 0 18px', height: 18, borderRadius: '50%', marginTop: 2, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, background: done ? '#E7F0E8' : '#FBE9E5', color: done ? '#1F4A33' : '#A8552F' }}>{done ? '✓' : '!'}</span>
      <span><span className="sr-only">{done ? 'Done: ' : 'To do: '}</span><Link href={href}>{children}</Link></span>
    </li>
  );
}

export default function Dashboard() {
  const [inq, setInq] = useState<InqStats | null>(null);
  const [recent, setRecent] = useState<Inquiry[] | null>(null);
  const [products, setProducts] = useState<ProductCounts | null>(null);
  const [gallery, setGallery] = useState<GalleryRow[] | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<ContentBlock[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [a, b, c, d, e, f] = await Promise.all([
        adminFetch<InqStats>('/admin/inquiries/stats'),
        adminFetch<{ items: Inquiry[] }>('/admin/inquiries?status=new&pageSize=6'),
        adminFetch<ProductCounts>('/admin/products/counts'),
        adminFetch<GalleryRow[]>('/admin/gallery'),
        adminFetch<SiteSettings>('/admin/settings'),
        adminFetch<ContentBlock[]>('/admin/content'),
      ]);
      setInq(a); setRecent(b.items); setProducts(c); setGallery(d); setSettings(e); setContent(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the dashboard.');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const notes = content?.filter((c) => c.fields?.clientNote).length ?? 0;
  const photoSlots = content?.filter((c) => PHOTO_TYPES.includes(c.type) || (c.type === 'page_copy' && 'imageUrl' in (c.fields ?? {}))) ?? [];
  const galleryStandIns = gallery?.filter((g) => g.published && !g.imageUrl).length ?? 0;
  const missingPhotos = photoSlots.filter((c) => !c.fields?.imageUrl).length;

  const stats: [string, number | undefined, string][] = [
    ['New enquiries', inq?.new, '/admin/inquiries'],
    ['Published beers', products?.published, '/admin/products'],
    ['Sample beers left', products?.samples, '/admin/products'],
    ['Gallery photos', gallery?.length, '/admin/gallery'],
  ];

  return (
    <>
      <div className="adm-head"><div><h1 className="adm-h1">Dashboard</h1><p className="adm-sub">New enquiries from the website, and what still needs real content before launch.</p></div></div>
      {error && <ErrorPanel message={error} onRetry={load} />}
      <div className="adm-grid" style={{ marginBottom: 28 }}>
        {stats.map(([label, v, href]) => <Link key={label} href={href} className="adm-card adm-stat" style={{ textDecoration: 'none', color: 'inherit' }}><p>{label}</p><p>{v ?? '–'}</p></Link>)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <section className="adm-card" style={{ flex: '2 1 420px' }} aria-labelledby="recent-h">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <h2 id="recent-h" className="serif" style={{ margin: 0, fontSize: 24 }}>New enquiries</h2>
            <Link href="/admin/inquiries" className="adm-btn ghost sm">All enquiries</Link>
          </div>
          {recent === null ? <div className="skel" style={{ height: 120 }} /> : recent.length === 0 ? <p className="hint">No new enquiries. You’re all caught up.</p> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {recent.map((i) => (
                <li key={i.id} style={{ padding: '12px 0', borderTop: '1px solid #E8DCC9' }}>
                  <Link href={`/admin/inquiries?open=${i.id}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span><strong>{i.name}</strong> <span className="hint">· {i.enquiryType}</span></span>
                    <span className="hint">{formatReceived(i.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {inq && inq.total > 0 && <p className="hint" style={{ marginTop: 12 }}>{inq.total} in total · {inq.responded} responded · {inq.archived} archived</p>}
        </section>

        <section className="adm-card" style={{ flex: '1 1 320px' }} aria-labelledby="launch-h">
          <h2 id="launch-h" className="serif" style={{ margin: '0 0 12px', fontSize: 24 }}>Launch checklist</h2>
          {!products || !settings || !content || !gallery ? <div className="skel" style={{ height: 180 }} /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <Item done={settings.phoneVerified} href="/admin/settings">{settings.phoneVerified ? 'Phone number verified' : 'Verify the phone number: 182 is not a valid area code (Bend uses 541/458). Until then it isn’t tap-to-call or in search data'}</Item>
              <Item done={settings.hoursVerified} href="/admin/settings">{settings.hoursVerified ? 'Opening hours confirmed' : 'Opening hours not supplied: the site shows “Hours to be confirmed” and no open/closed status'}</Item>
              <Item done={products.samples === 0} href="/admin/products">{products.samples ? `${products.samples} of ${products.total} beers are still samples` : 'No sample beers left'}</Item>
              <Item done={products.noSpecs === 0} href="/admin/products">{products.noSpecs ? `${products.noSpecs} beers have no ABV or IBU (hidden, “to be supplied” shown)` : 'Every beer has confirmed specs'}</Item>
              <Item done={products.noPhoto === 0} href="/admin/products">{products.noPhoto ? `${products.noPhoto} beers show an illustration instead of a photo` : 'Every beer has a photo'}</Item>
              <Item done={missingPhotos === 0} href="/admin/content">{missingPhotos ? `${missingPhotos} of ${photoSlots.length} page photo slots still show illustrations` : 'All page photo slots have real photos'}</Item>
              <Item done={galleryStandIns === 0} href="/admin/gallery">{galleryStandIns ? `${galleryStandIns} gallery items still use stand-in illustrations` : 'Gallery uses real photos'}</Item>
              <Item done={notes === 0} href="/admin/content">{notes ? `${notes} content blocks still show “To be supplied” notes (story, values, visitor info…)` : 'No placeholder notes left'}</Item>
              <Item done={!!settings.privacyUrl} href="/admin/settings">{settings.privacyUrl ? 'Privacy policy linked' : 'Add a privacy policy link (the enquiry form collects personal details)'}</Item>
              <Item done={false} href="/admin/settings">{settings.ageGateEnabled ? 'Age gate is on: have the brewery confirm it meets Oregon and platform rules' : 'Age gate is off: confirm with the brewery that this is acceptable'}</Item>
              <Item done={settings.socialLinks.length > 0} href="/admin/settings">{settings.socialLinks.length ? `${settings.socialLinks.length} official social links added` : 'No social links yet (optional; official accounts only)'}</Item>
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
