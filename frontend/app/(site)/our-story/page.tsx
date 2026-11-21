import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/site/Icons';
import { ImageBand, Photo } from '@/components/site/Photo';
import { PhotoStrip } from '@/components/site/PhotoStrip';
import { Em, Stop, SupplyNote } from '@/components/site/Text';
import { copy, getContent, getGallery, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Get to know the craft, inspiration and character behind The Craft Brewery in Bend, Oregon.',
  alternates: { canonical: '/our-story' },
};

export default async function StoryPage() {
  const [settings, pc, chapters, values, gallery] = await Promise.all([getSettings(), getPageCopy(), getContent('story_chapter'), getContent('brand_value'), getGallery()]);
  const hero = copy(pc, 'story_hero');
  const intro = copy(pc, 'story_intro');
  const quote = copy(pc, 'story_quote');
  const vals = copy(pc, 'story_values');
  const atmo = copy(pc, 'story_atmosphere');
  const cta = copy(pc, 'story_cta');
  const strip = gallery.items.filter((g) => g.category === 'Brewery' || g.category === 'Details').slice(0, 8);

  return (
    <main id="main">
      <section className="dark grain" aria-labelledby="s-h" style={{ position: 'relative', minHeight: 'min(92vh, 900px)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Photo src={hero.imageUrl} art={hero.fields.art || 'barrels'} alt={hero.alt} caption={false} priority decorative imgClass={settings.autoMotion ? 'kb' : ''} style={{ position: 'absolute', inset: 0 }} />
        <div className="shade" aria-hidden="true" />
        <div className="wrap stack" style={{ position: 'relative', gap: 24, paddingBlock: '160px clamp(56px, 8vw, 112px)' }}>
          {hero.eyebrow && <p className="label in">{hero.eyebrow}</p>}
          <h1 id="s-h" className="d-hero in d1" style={{ maxWidth: '12ch' }}><Stop text={hero.title} /></h1>
          {hero.body && <p className="lead in d2" style={{ color: 'var(--oat)', maxWidth: '32em' }}>{hero.body}</p>}
          {!hero.imageUrl && <p className="xs muted in d3">Photo to be supplied</p>}
        </div>
      </section>

      <section className="light grain sec" aria-labelledby="ch-h">
        <div className="wrap stack" style={{ gap: 'clamp(48px, 6vw, 88px)' }}>
          <div className="g12 rv" style={{ alignItems: 'end' }}>
            <div className="stack" style={{ gridColumn: '1 / span 7', gap: 18 }}>
              {intro.eyebrow && <p className="label">{intro.eyebrow}</p>}
              <h2 id="ch-h" className="d-xl"><Em text={intro.title} /></h2>
            </div>
            <div style={{ gridColumn: '8 / span 5' }}>{intro.body ? <p className="lead">{intro.body}</p> : <SupplyNote note={intro.clientNote} tag="Story to be supplied" />}</div>
          </div>
          <ol style={{ listStyle: 'none' }} className="stack">
            {chapters.map((c, i) => (
              <li key={c.id} className="g12 rv" style={{ alignItems: 'center', paddingBlock: 'clamp(32px, 4vw, 56px)', borderTop: '1px solid var(--line-l)' }}>
                <span className="idx" aria-hidden="true" style={{ gridColumn: i % 2 ? '11 / span 2' : '1 / span 2', gridRow: 1, color: 'var(--copper-d)' }}>{c.fields.numeral || String(i + 1)}</span>
                <div className="stack" style={{ gridColumn: i % 2 ? '1 / span 6' : '3 / span 5', gridRow: 1, gap: 14 }}>
                  <h3 className="d-m">{c.title}</h3>
                  {c.body ? <p style={{ whiteSpace: 'pre-line' }}>{c.body}</p> : <SupplyNote note={c.fields.clientNote} tag="To be supplied" />}
                </div>
                {(c.fields.imageUrl || c.fields.art) && (
                  <Photo src={c.fields.imageUrl} art={c.fields.art} alt={c.fields.alt || c.title} className="zoom" style={{ gridColumn: i % 2 ? '7 / span 4' : '9 / span 4', gridRow: 1, aspectRatio: '4 / 3' }} />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {quote.fields.quote && (
        <section className="dark grain sec" aria-label="Quote">
          <figure className="wrap stack rv" style={{ gap: 24, maxWidth: 980 }}>
            <blockquote className="d-l" style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', textTransform: 'none' }}>“{quote.fields.quote}”</blockquote>
            {quote.fields.quoteBy && <figcaption className="meta">— {quote.fields.quoteBy}</figcaption>}
          </figure>
        </section>
      )}

      {values.length > 0 && (
        <section className="smoke grain sec" aria-labelledby="v-h">
          <div className="wrap stack" style={{ gap: 'clamp(36px, 5vw, 64px)' }}>
            <div className="between rv">
              <div className="stack" style={{ gap: 18 }}>{vals.eyebrow && <p className="label">{vals.eyebrow}</p>}<h2 id="v-h" className="d-xl"><Em text={vals.title} /></h2></div>
              {vals.clientNote && <span className="tbs">{vals.clientNote}</span>}
            </div>
            <ul className="cols-4" style={{ listStyle: 'none' }}>
              {values.map((v, i) => (
                <li key={v.id} className="stack rv" style={{ gap: 14 }}>
                  <Photo src={v.fields.imageUrl} art={v.fields.art} alt={v.title} caption={false} decorative className="zoom" style={{ aspectRatio: '3 / 4' }} />
                  <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="d-s">{v.title}</h3>
                  {v.body && <p className="small muted">{v.body}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {strip.length > 2 && (
        <section className="dark grain sec-s" aria-labelledby="a-h" style={{ overflow: 'hidden' }}>
          <PhotoStrip enabled={settings.autoMotion} title={<h2 id="a-h" className="d-l"><Em text={atmo.title} /></h2>} photos={strip.map((g) => ({ src: g.imageUrl, art: g.art, alt: g.alt, ratio: g.ratio, focus: g.focus }))} />
        </section>
      )}

      <ImageBand src={cta.imageUrl} art={cta.fields.art || 'exterior'} label="sc-h">
        <div className="stack rv" style={{ gap: 26, maxWidth: 760 }}>
          <h2 id="sc-h" className="d-xl"><Em text={cta.title} /></h2>
          <p className="lead" style={{ color: 'var(--oat)' }}>{settings.addressLine1}, {settings.city}, {settings.region}.</p>
          <div className="row btn-row-m">
            <Link className="btn btn-copper" href="/visit-us">{cta.fields.cta || 'Find Us'} <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link>
            <Link className="btn btn-ghost" href="/brewing-process">{cta.fields.cta2 || 'See the Brewing Process'}</Link>
          </div>
        </div>
      </ImageBand>
    </main>
  );
}
