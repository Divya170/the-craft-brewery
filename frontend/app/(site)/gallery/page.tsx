import type { Metadata } from 'next';
import Link from 'next/link';
import { GalleryBrowser } from '@/components/site/GalleryBrowser';
import { Icon } from '@/components/site/Icons';
import { Stop } from '@/components/site/Text';
import { copy, getGallery, getPageCopy } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A look around The Craft Brewery: the brewery, the brewing process, ingredients, products and details.',
  alternates: { canonical: '/gallery' },
};

export default async function GalleryPage() {
  const [pc, g] = await Promise.all([getPageCopy(), getGallery()]);
  const hero = copy(pc, 'gallery_hero');
  return (
    <main id="main">
      <section className="dark grain page-top" aria-labelledby="g-h" style={{ paddingBottom: 'clamp(32px, 4vw, 56px)' }}>
        <div className="wrap stack" style={{ gap: 22 }}>
          {hero.eyebrow && <p className="label in">{hero.eyebrow}</p>}
          <h1 id="g-h" className="d-hero in d1"><Stop text={hero.title} /></h1>
          {hero.body && <p className="lead in d2" style={{ maxWidth: '32em' }}>{hero.body}</p>}
        </div>
      </section>
      <section className="dark grain" aria-label="Photos" style={{ paddingBottom: 'clamp(64px, 8vw, 120px)' }}>
        <div className="wrap stack" style={{ gap: 32 }}>
          {g.items.length ? <GalleryBrowser items={g.items} categories={g.categories} /> : <p className="muted">Photos are on their way.</p>}
          <div className="row btn-row-m" style={{ paddingTop: 24 }}><Link className="btn btn-copper" href="/visit-us">See It in Person <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link></div>
        </div>
      </section>
    </main>
  );
}
