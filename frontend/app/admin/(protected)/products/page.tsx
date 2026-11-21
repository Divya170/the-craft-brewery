'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { adminFetch } from '@/lib/admin-api';
import { ART_OPTIONS } from '@/lib/admin-options';

const STATUS = [
  { value: 'sample', label: 'Samples (placeholders)' }, { value: 'real', label: 'Real beers' }, { value: 'nospecs', label: 'Missing ABV & IBU' },
  { value: 'nophoto', label: 'No photo' }, { value: 'featured', label: 'Featured on home' }, { value: 'hidden', label: 'Hidden' },
];

export default function ProductsAdmin() {
  const [styles, setStyles] = useState<{ value: string; label: string }[] | null>(null);
  const [counts, setCounts] = useState<{ total: number; samples: number; noSpecs: number; noPhoto: number } | null>(null);
  useEffect(() => {
    adminFetch<{ id: number; name: string }[]>('/admin/styles').then((r) => setStyles(r.map((s) => ({ value: String(s.id), label: s.name })))).catch(() => setStyles([]));
    adminFetch<{ total: number; samples: number; noSpecs: number; noPhoto: number }>('/admin/products/counts').then(setCounts).catch(() => undefined);
  }, []);
  if (!styles) return <p role="status">Loading styles…</p>;

  return (
    <>
      {counts && counts.samples > 0 && (
        <div className="adm-card" role="note" style={{ marginBottom: 20, borderLeft: '4px solid #B87333' }}>
          <strong>{counts.samples} of {counts.total} beers are samples.</strong> Replace each with a real beer name, description and photo, then untick “Sample product”. Only enter ABV, IBU, ingredients and tasting notes the brewery has confirmed: empty fields are simply hidden on the site. {counts.noSpecs} without specs · {counts.noPhoto} without photos.
        </div>
      )}
      <EntityManager
        title="Products"
        singular="Beer"
        subtitle="The informational lineup on Our Products. There is no pricing, cart or ordering."
        endpoint="/admin/products"
        searchPlaceholder="Search beer names…"
        filters={[{ name: 'styleId', label: 'Style', options: styles }, { name: 'status', label: 'Status', options: STATUS }]}
        defaults={{ name: '', styleId: styles[0]?.value ?? '', shortDescription: '', description: '', abv: '', ibu: '', ingredients: '', tastingNotes: '', serving: '', imageAlt: '', art: 'glass-ale', featured: false, isSample: false, published: true }}
        fields={[
          { name: 'name', label: 'Beer name', type: 'text', required: true },
          { name: 'styleId', label: 'Style', type: 'select', options: styles, numeric: true, required: true },
          { name: 'shortDescription', label: 'Short description (cards)', type: 'textarea', nullable: true },
          { name: 'description', label: 'Full description', type: 'textarea', nullable: true },
          { name: 'abv', label: 'ABV %', type: 'number', nullable: true, help: 'e.g. 5.4. Leave empty until confirmed: it is hidden on the site.' },
          { name: 'ibu', label: 'IBU', type: 'number', nullable: true, help: 'Whole number, 0–150. Leave empty until confirmed.' },
          { name: 'ingredients', label: 'Ingredients', type: 'textarea', nullable: true },
          { name: 'tastingNotes', label: 'Tasting notes', type: 'textarea', nullable: true },
          { name: 'serving', label: 'Serving suggestion', type: 'text', nullable: true },
          { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text', nullable: true },
          { name: 'art', label: 'Illustration shown until a photo is uploaded', type: 'select', options: ART_OPTIONS },
          { name: 'featured', label: 'Featured on the homepage', type: 'boolean', help: 'The first five featured beers appear in the homepage lineup.' },
          { name: 'isSample', label: 'Sample product (placeholder)', type: 'boolean', help: 'Shows a “Sample” tag on the site. Untick once this is a real beer.' },
          { name: 'sortOrder', label: 'Display order', type: 'number' },
          { name: 'published', label: 'Published', type: 'boolean' },
        ]}
        columns={[
          { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" />) },
          { label: 'Beer', render: (r) => <><strong>{r.name}</strong>{r.isSample && <span className="pill pill-todo" style={{ marginLeft: 8 }}>Sample</span>}</> },
          { label: 'Style', render: (r) => r.style?.name ?? '—' },
          { label: 'ABV / IBU', render: (r) => (r.abv == null && r.ibu == null ? <span className="pill pill-todo">To be supplied</span> : `${r.abv != null ? `${Number(r.abv).toFixed(1)}%` : '—'} / ${r.ibu ?? '—'}`) },
          { label: 'Home', render: (r) => (r.featured ? 'Featured' : '—') },
          { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
        ]}
        image={{ getUrl: (r) => r.imageUrl, label: 'Product photo', hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Real photos of this beer only.' }}
        emptyText="No beers yet. Add the first one."
        rowLabel={(r) => r.name}
      />
    </>
  );
}
