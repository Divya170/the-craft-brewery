'use client';

/* eslint-disable @next/next/no-img-element */
import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { ART_OPTIONS } from '@/lib/admin-options';

const TYPES = [
  { value: 'page_copy', label: 'Page copy' },
  { value: 'hero_slide', label: 'Home: hero photo' },
  { value: 'story_chapter', label: 'Our Story: chapter' },
  { value: 'brand_value', label: 'Our Story: value' },
  { value: 'process_stage', label: 'Process: stage' },
  { value: 'ingredient', label: 'Process: ingredient' },
  { value: 'visitor_info', label: 'Visit: visitor info' },
];
const typeLabel = (t: string) => TYPES.find((x) => x.value === t)?.label ?? t;
type V = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const PHOTO_TYPES = ['hero_slide', 'story_chapter', 'brand_value', 'process_stage', 'ingredient'];
const hasPhoto = (v: V) => PHOTO_TYPES.includes(v.type) || (v.type === 'page_copy' && 'imageUrl' in (v.fields ?? {}));
const is = (...t: string[]) => (v: V) => t.includes(v.type);
/** Page copy shows a field only if that block was seeded with it, so editors never see options a section can't use. */
const has = (f: string) => (v: V) => v.type === 'page_copy' && f in (v.fields ?? {});

export default function ContentAdmin() {
  return (
    <EntityManager
      title="Page content"
      singular="Content block"
      subtitle="Headings, text and photos across the site. Wrap words in *asterisks* for the copper italic accent. Clear a “To be supplied” note once the real copy is approved. Never add founders, dates, history, awards, reviews, facilities or beer details unless The Craft Brewery has supplied and verified them."
      endpoint="/admin/content"
      searchPlaceholder="Search titles, text or keys…"
      filters={[{ name: 'type', label: 'Type', options: TYPES }]}
      defaults={{ type: 'visitor_info', key: '', title: '', body: '', fields: { clientNote: '', art: 'tanks', alt: '' }, published: true }}
      fields={[
        { name: 'type', label: 'Type', type: 'select', options: TYPES, createOnly: true, required: true },
        { name: 'key', label: 'Key', type: 'text', nullable: true, createOnly: true, showIf: is('page_copy'), help: 'Page copy is looked up by key (e.g. home_hero). The existing keys are already created.' },
        { name: 'title', label: 'Title / heading', type: 'textarea', required: true, help: 'For hero photos, this is the caption.' },
        { name: 'body', label: 'Body text', type: 'textarea', nullable: true, showIf: (v) => !is('hero_slide')(v), help: 'For a story chapter, leave a blank line between paragraphs. Leave empty to keep the “To be supplied” note showing.' },
        { name: 'fields.eyebrow', label: 'Small label above the heading', type: 'text', showIf: has('eyebrow') },
        { name: 'fields.body2', label: 'Extra paragraph', type: 'textarea', showIf: has('body2') },
        { name: 'fields.quote', label: 'Quote', type: 'textarea', showIf: has('quote'), help: 'Leave empty to hide the quote section. Real, approved words only.' },
        { name: 'fields.quoteBy', label: 'Quote attribution', type: 'text', showIf: has('quoteBy') },
        { name: 'fields.cta', label: 'Button / link text', type: 'text', showIf: has('cta') },
        { name: 'fields.cta2', label: 'Second button text', type: 'text', showIf: has('cta2') },
        { name: 'fields.numeral', label: 'Chapter numeral', type: 'text', showIf: is('story_chapter') },
        { name: 'fields.more', label: '“More” detail (expands)', type: 'textarea', showIf: is('process_stage') },
        { name: 'fields.alt', label: 'Photo description (alt text)', type: 'text', showIf: hasPhoto },
        { name: 'fields.art', label: 'Illustration shown until a photo is uploaded', type: 'select', options: [{ value: '', label: 'None' }, ...ART_OPTIONS], showIf: hasPhoto },
        { name: 'fields.focus', label: 'Photo focal point', type: 'text', showIf: is('process_stage', 'ingredient'), help: 'e.g. 50% 50%' },
        { name: 'fields.clientNote', label: '“To be supplied” note', type: 'textarea', showIf: (v) => is('page_copy', 'story_chapter', 'visitor_info')(v), help: 'Shown on the site as a dashed placeholder note. Clear it once the real content is in.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Type', render: (r) => typeLabel(r.type) },
        { label: 'Key', render: (r) => (r.key ? <code style={{ fontSize: 12 }}>{r.key}</code> : '—') },
        { label: 'Title', render: (r) => <><span style={{ display: 'block', maxWidth: 420 }}>{String(r.title).slice(0, 90)}</span>{r.fields?.clientNote && <span className="pill pill-todo">Needs content</span>}</> },
        { label: 'Photo', render: (r) => (r.fields?.imageUrl ? <img className="thumb" src={mediaUrl(r.fields.imageUrl) ?? ''} alt="" /> : hasPhoto(r) ? <div className="thumb-ph" /> : '—') },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{
        getUrl: (r) => r.fields?.imageUrl,
        hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Genuine photos of The Craft Brewery only: never stock images presented as the brewery.',
        slots: [{ slot: '', label: 'Photo', getUrl: (r) => r.fields?.imageUrl, show: hasPhoto }],
      }}
      emptyText="No content blocks."
      rowLabel={(r) => (r.key ? `${typeLabel(r.type)} · ${r.key}` : `${typeLabel(r.type)} · ${String(r.title).slice(0, 40)}`)}
    />
  );
}
