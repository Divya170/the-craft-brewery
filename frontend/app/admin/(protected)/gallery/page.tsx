'use client';

/* eslint-disable @next/next/no-img-element */
import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { ART_OPTIONS, GALLERY_CATEGORY_OPTIONS, RATIO_OPTIONS } from '@/lib/admin-options';

export default function GalleryAdmin() {
  return (
    <EntityManager
      title="Gallery"
      singular="Photo"
      subtitle="Photos on the Gallery page and the homepage preview. Until a real photo is uploaded, the site shows the chosen illustration labelled as a stand-in."
      endpoint="/admin/gallery"
      searchPlaceholder="Search titles or descriptions…"
      filters={[{ name: 'category', label: 'Category', options: GALLERY_CATEGORY_OPTIONS }]}
      defaults={{ title: '', category: 'Brewery', alt: '', ratio: '4 / 3', focus: '50% 50%', art: 'taproom', featuredOnHome: false, published: true }}
      fields={[
        { name: 'title', label: 'Caption', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: GALLERY_CATEGORY_OPTIONS, required: true },
        { name: 'alt', label: 'Photo description (alt text)', type: 'text', required: true, help: 'Describe what’s in the photo for screen-reader users.' },
        { name: 'ratio', label: 'Shape in the grid', type: 'select', options: RATIO_OPTIONS },
        { name: 'focus', label: 'Focal point', type: 'text', help: 'Which part stays in view when cropped, e.g. “50% 50%” (centre) or “30% 20%” (upper left).' },
        { name: 'art', label: 'Illustration shown until a photo is uploaded', type: 'select', options: ART_OPTIONS },
        { name: 'featuredOnHome', label: 'Show in the homepage preview', type: 'boolean', help: 'The first five appear on the homepage.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" title="Stand-in illustration" />) },
        { label: 'Caption', render: (r) => <><strong>{r.title}</strong>{!r.imageUrl && <span className="pill pill-todo" style={{ marginLeft: 8 }}>Needs photo</span>}</> },
        { label: 'Category', render: (r) => r.category },
        { label: 'Home', render: (r) => (r.featuredOnHome ? 'Yes' : '—') },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl, hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Genuine photos of The Craft Brewery only: never stock images presented as the brewery.' }}
      emptyText="No photos yet."
      rowLabel={(r) => r.title}
    />
  );
}
