import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/site/Icons';
import { ImageBand, Photo } from '@/components/site/Photo';
import { ProductBrowser } from '@/components/site/ProductBrowser';
import { Em, Stop } from '@/components/site/Text';
import { copy, getPageCopy, getProducts, getStyles } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Our Products',
  description: 'Explore the beers of The Craft Brewery in Bend, Oregon: lagers, ales, IPAs, stouts and seasonal brews.',
  alternates: { canonical: '/products' },
};

export default async function ProductsPage({ searchParams }: { searchParams: { style?: string } }) {
  const [pc, products, styles] = await Promise.all([getPageCopy(), getProducts(), getStyles()]);
  const hero = copy(pc, 'products_hero');
  const cta = copy(pc, 'products_cta');
  return (
    <main id="main">
      <section className="smoke grain page-top" aria-labelledby="p-h" style={{ position: 'relative', overflow: 'hidden', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
        <div className="wrap g12" style={{ alignItems: 'end' }}>
          <div className="stack" style={{ gridColumn: '1 / span 7', gap: 24, position: 'relative', zIndex: 2 }}>
            {hero.eyebrow && <p className="label in">{hero.eyebrow}</p>}
            <h1 id="p-h" className="d-hero in d1"><Stop text={hero.title || 'Explore the craft.'} /></h1>
            {hero.body && <p className="lead in d2">{hero.body}</p>}
            {products.some((p) => p.isSample) && <div className="row in d3"><span className="tbs">Sample products until the real lineup is supplied</span></div>}
          </div>
          <Photo src={hero.imageUrl} art={hero.fields.art || 'flight'} alt={hero.alt || 'A flight of beers'} caption="Product photo to be supplied" priority corners className="in d2" style={{ gridColumn: '8 / span 5', aspectRatio: '4 / 5', border: '1px solid var(--line-d)' }} />
        </div>
      </section>
      <section id="lineup" className="dark grain sec" aria-label="Product lineup" style={{ paddingTop: 'clamp(48px, 6vw, 88px)' }}>
        <div className="wrap"><ProductBrowser products={products} styles={styles} initialStyle={searchParams.style ?? ''} /></div>
      </section>
      <ImageBand src={cta.imageUrl} art={cta.fields.art || 'barrels'} direction="up" label="pv-h">
        <div className="stack" style={{ gap: 28, alignItems: 'flex-start' }}>
          <p className="label">Visit</p>
          <h2 id="pv-h" className="d-xl" style={{ maxWidth: '14ch' }}><Em text={cta.title} /></h2>
          <Link className="btn btn-copper" href="/visit-us">{cta.fields.cta || 'Visit The Brewery'} <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link>
        </div>
      </ImageBand>
    </main>
  );
}
