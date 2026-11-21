'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { Icon } from './Icons';
import { Photo } from './Photo';

/** Homepage featured-beer showcase: one large product with an understated list to switch between the lineup. */
export function Lineup({ products }: { products: Product[] }) {
  const [i, setI] = useState(0);
  const p = products[i];
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="g12" style={{ alignItems: 'stretch' }}>
      <div style={{ gridColumn: '1 / span 6', position: 'relative' }}>
        <Photo key={p.id} src={p.imageUrl} art={p.art} alt={p.imageAlt} caption="Product photo to be supplied" style={{ aspectRatio: '9 / 10', border: '1px solid var(--line-d)', animation: 'rise .7s var(--ease) both' }}>
          {p.isSample && <span className="sample">Sample</span>}
        </Photo>
      </div>
      <div className="stack" style={{ gridColumn: '7 / span 6', gap: 26, justifyContent: 'space-between' }}>
        <div className="stack" style={{ gap: 20 }} aria-live="polite">
          <p className="label plain" style={{ fontSize: '.8rem' }}>{pad(i + 1)} — {p.style?.name}</p>
          <h3 className="d-l">{p.name}</h3>
          {p.shortDescription && <p className="lead">{p.shortDescription}</p>}
          {p.specs.length > 0
            ? <dl className="specs">{p.specs.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
            : <p><span className="tbs">ABV, IBU &amp; tasting notes to be supplied</span></p>}
          <Link className="tlink" href={`/products/${p.slug}`} style={{ alignSelf: 'flex-start' }}><span>View details</span><Icon name="arrow" /></Link>
        </div>
        {products.length > 1 && (
          <div className="stack" style={{ gap: 6 }}>
            <p className="meta" style={{ marginBottom: 8 }} id="lineup-label">Browse the lineup</p>
            <div role="group" aria-labelledby="lineup-label">
              {products.map((x, n) => (
                <button key={x.id} type="button" aria-pressed={n === i} onClick={() => setI(n)}
                  style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%', minHeight: 56, padding: '10px 0', border: 0, borderTop: '1px solid var(--line-d)', background: 'none', cursor: 'pointer', color: n === i ? 'var(--copper-l)' : 'var(--white)', opacity: n === i ? 1 : 0.72, transition: 'color .3s, opacity .3s' }}>
                  <span style={{ font: '400 1rem/1 var(--fd)', color: 'var(--brass)', width: 28 }}>{pad(n + 1)}</span>
                  <span style={{ flex: 1, font: '400 1.6rem/1 var(--fd)', letterSpacing: '.03em', textAlign: 'left' }}>{x.name}</span>
                  <span className="meta">{x.style?.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
