'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Product, Style } from '@/lib/types';
import { Icon } from './Icons';
import { Photo } from './Photo';

const SPANS = [7, 5, 4, 4, 4, 5, 7, 6];

/**
 * Style filters + asymmetric product grid. Filters update instantly (no reload) and are mirrored in ?style=
 * so a filtered view can be shared. Only styles that actually have beers are offered.
 */
export function ProductBrowser({ products, styles, initialStyle }: { products: Product[]; styles: Style[]; initialStyle: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? '/products';
  const valid = styles.some((s) => s.slug === initialStyle) ? initialStyle : '';
  const [style, setStyle] = useState(valid);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    router.replace(style ? `${pathname}?style=${style}` : pathname, { scroll: false });
  }, [style]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = style ? products.filter((p) => p.style?.slug === style) : products;
  const anySample = list.some((p) => p.isSample);
  const label = styles.find((s) => s.slug === style)?.pluralName;

  return (
    <div className="stack" style={{ gap: 'clamp(28px, 4vw, 48px)' }}>
      <div className="between" style={{ alignItems: 'center', gap: 18, paddingBottom: 22, borderBottom: '1px solid var(--line-d)' }}>
        {styles.length > 1 && (
          <div className="chips" role="group" aria-label="Filter by beer style">
            <button type="button" className="chip" aria-pressed={!style} onClick={() => setStyle('')}>All products <span className="n">{products.length}</span></button>
            {styles.map((s) => <button key={s.slug} type="button" className="chip" aria-pressed={style === s.slug} onClick={() => setStyle(s.slug)}>{s.pluralName} <span className="n">{s.count}</span></button>)}
          </div>
        )}
        <div className="row" style={{ gap: 16, marginLeft: 'auto' }}>
          <p className="small muted" aria-live="polite">{list.length} {list.length === 1 ? 'beer' : 'beers'}{label ? ` · ${label}` : ''}{anySample ? ' · samples' : ''}</p>
          {style && <button type="button" className="tlink" onClick={() => setStyle('')}><span>Reset filter</span></button>}
        </div>
      </div>

      {list.length > 0 ? (
        <div className="pgrid" key={style || 'all'}>
          {list.map((p, i) => {
            const span = list.length < 3 ? 6 : SPANS[i % SPANS.length];
            return (
              <Link key={p.id} href={`/products/${p.slug}`} className={`pcard ${span >= 6 && list.length >= 3 ? 'wide' : ''}`} style={{ gridColumn: `span ${span}`, animationDelay: `${Math.min(i, 8) * 60}ms`, textDecoration: 'none' }}>
                <Photo src={p.imageUrl} art={p.art} alt={p.imageAlt} caption={false} decorative>{p.isSample && <span className="sample">Sample</span>}</Photo>
                <span className="pc-cat">{p.style?.name}</span>
                <span className="pc-name">{p.name}</span>
                {p.shortDescription && <span className="pc-desc">{p.shortDescription}</span>}
                {p.specs.length > 0
                  ? <dl className="specs">{p.specs.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
                  : <span className="row"><span className="tbs">ABV &amp; IBU to be supplied</span></span>}
                <span className="more">View details <Icon name="arrow" size={16} sw={2.2} /></span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="stack" style={{ gap: 20, alignItems: 'flex-start', padding: 'clamp(32px, 5vw, 64px)', border: '1px dashed var(--line-d)' }}>
          <p className="label plain">Nothing here yet</p>
          <h3 className="d-m">{products.length ? 'No beers in this style right now.' : 'The lineup is on its way.'}</h3>
          <p className="muted" style={{ maxWidth: '34em' }}>{products.length ? 'This style may return. In the meantime, see the full lineup, or ask what’s pouring when you visit.' : 'Beers will appear here as soon as the brewery adds them. In the meantime, come and see what’s brewing.'}</p>
          <div className="row btn-row-m">{products.length > 0 && <button type="button" className="btn btn-copper" onClick={() => setStyle('')}>Show All Products</button>}<Link className="btn btn-ghost" href="/visit-us">Plan Your Visit</Link></div>
        </div>
      )}
      <p className="xs muted">An informational lineup only: there is no online ordering, cart or delivery.</p>
    </div>
  );
}
