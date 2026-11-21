'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { artUrl, mediaUrl } from '@/lib/api';
import type { GalleryItem } from '@/lib/types';
import { Icon } from './Icons';

/** Category filters, masonry grid and an accessible lightbox (←/→ to browse, Esc to close, focus returned on close). */
export function GalleryBrowser({ items, categories }: { items: GalleryItem[]; categories: { name: string; count: number }[] }) {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(-1);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const list = cat === 'All' ? items : items.filter((g) => g.category === cat);

  const close = () => { setOpen(-1); setTimeout(() => opener.current?.focus(), 0); };
  const step = (d: number) => setOpen((o) => (o + d + list.length) % list.length);

  useEffect(() => {
    if (open < 0) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open >= 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const cur = open >= 0 ? list[open] : null;
  const src = (g: GalleryItem) => mediaUrl(g.imageUrl) ?? artUrl(g.art);
  const anyStandIn = items.some((g) => !g.imageUrl);

  return (
    <>
      <div className="between" style={{ alignItems: 'center', paddingBottom: 22, borderBottom: '1px solid var(--line-d)' }}>
        {categories.length > 2 && (
          <div className="chips" role="group" aria-label="Filter photos">
            {categories.map((c) => <button key={c.name} type="button" className="chip" aria-pressed={cat === c.name} onClick={() => setCat(c.name)}>{c.name} <span className="n">{c.count}</span></button>)}
          </div>
        )}
        <p className="small muted" aria-live="polite" style={{ marginLeft: 'auto' }}>{list.length} {list.length === 1 ? 'photo' : 'photos'}</p>
      </div>
      {list.length ? (
        <div className="masonry" key={cat}>
          {list.map((g, i) => (
            <figure key={g.id} style={{ animation: 'rise .6s var(--ease) both', animationDelay: `${Math.min(i, 10) * 50}ms` }}>
              <button type="button" className="gitem" aria-haspopup="dialog" aria-label={`Open photo: ${g.alt || g.title}`} onClick={(e) => { opener.current = e.currentTarget; setOpen(i); }}>
                <div className="ph" style={{ aspectRatio: g.ratio }}><img src={src(g)} alt="" loading="lazy" decoding="async" style={{ objectPosition: g.focus }} /></div>
              </button>
              <figcaption>{g.title} · <span style={{ color: 'var(--brass)' }}>{g.category}</span></figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="muted">No photos in this category yet.</p>
      )}
      {anyStandIn && <p className="xs muted">Illustrated stand-ins are shown until real photos are uploaded. The gallery never auto-advances.</p>}

      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <div className="between wrap" style={{ alignItems: 'center', paddingBlock: 18 }}>
            <p className="meta" aria-live="polite">{open + 1} / {list.length} · {cur.category}</p>
            <button ref={closeBtn} type="button" className="icon-btn" aria-label="Close photo viewer" onClick={close}><Icon name="close" size={20} sw={1.8} /></button>
          </div>
          <div className="lb-stage">
            <img key={cur.id} src={src(cur)} alt={cur.imageUrl ? cur.alt : `Illustration: ${cur.alt}`} style={{ objectPosition: cur.focus }} />
            {list.length > 1 && <>
              <button type="button" className="icon-btn lb-prev" aria-label="Previous photo" onClick={() => step(-1)}><Icon name="chevL" size={22} sw={1.8} /></button>
              <button type="button" className="icon-btn lb-next" aria-label="Next photo" onClick={() => step(1)}><Icon name="chevR" size={22} sw={1.8} /></button>
            </>}
          </div>
          <div className="wrap" style={{ paddingBlock: '18px 28px', textAlign: 'center' }}>
            <p style={{ font: '400 1.2rem/1.4 var(--fs)' }}>{cur.title}</p>
            <p className="xs muted" style={{ marginTop: 6 }}>Use ← → to browse, Esc to close{!cur.imageUrl ? ' · Photo to be supplied' : ''}</p>
          </div>
        </div>
      )}
    </>
  );
}
