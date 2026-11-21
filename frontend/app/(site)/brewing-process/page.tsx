import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/site/Icons';
import { ImageBand, Photo } from '@/components/site/Photo';
import { Timeline } from '@/components/site/Timeline';
import { Em, Stop, SupplyNote } from '@/components/site/Text';
import { copy, getContent, getPageCopy } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Brewing Process',
  description: 'How craft beer is made, from choosing ingredients to mashing, boiling, fermentation, conditioning and packaging.',
  alternates: { canonical: '/brewing-process' },
};

export default async function ProcessPage() {
  const [pc, stages, ingredients] = await Promise.all([getPageCopy(), getContent('process_stage'), getContent('ingredient')]);
  const hero = copy(pc, 'process_hero');
  const intro = copy(pc, 'process_intro');
  const journey = copy(pc, 'process_journey');
  const ingr = copy(pc, 'process_ingredients');
  const cta = copy(pc, 'process_cta');

  return (
    <main id="main">
      <section className="dark grain" aria-labelledby="bp-h" style={{ position: 'relative', minHeight: 'min(88vh, 860px)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Photo src={hero.imageUrl} art={hero.fields.art || 'kettle'} alt={hero.alt} caption={false} priority decorative style={{ position: 'absolute', inset: 0 }} />
        <div className="shade" aria-hidden="true" />
        <div className="wrap stack" style={{ position: 'relative', gap: 24, paddingBlock: '160px clamp(56px, 8vw, 112px)' }}>
          {hero.eyebrow && <p className="label in">{hero.eyebrow}</p>}
          <h1 id="bp-h" className="d-hero in d1" style={{ maxWidth: '13ch' }}><Stop text={hero.title} /></h1>
        </div>
      </section>

      <section className="light grain sec" aria-labelledby="in-h">
        <div className="wrap g12" style={{ alignItems: 'start' }}>
          <div className="stack rv" style={{ gridColumn: '1 / span 6', gap: 18 }}>
            {intro.eyebrow && <p className="label">{intro.eyebrow}</p>}
            <h2 id="in-h" className="d-xl"><Em text={intro.title} /></h2>
          </div>
          <div className="stack rv" style={{ gridColumn: '8 / span 5', gap: 18 }}>
            {intro.body && <p className="lead">{intro.body}</p>}
            {intro.fields.body2 && <p>{intro.fields.body2}</p>}
            <SupplyNote note={intro.clientNote} tag="General information" />
          </div>
        </div>
      </section>

      {stages.length > 0 && (
        <section className="dark grain sec" aria-labelledby="j-h">
          <div className="wrap stack" style={{ gap: 'clamp(32px, 4vw, 56px)' }}>
            <div className="stack rv" style={{ gap: 18 }}>{journey.eyebrow && <p className="label">{journey.eyebrow}</p>}<h2 id="j-h" className="d-xl"><Em text={journey.title} /></h2></div>
            <Timeline stages={stages.map((s) => ({ id: s.id, title: s.title, body: s.body ?? '', more: s.fields.more ?? null, src: s.fields.imageUrl ?? null, art: s.fields.art ?? null, focus: s.fields.focus || '50% 50%' }))} />
          </div>
        </section>
      )}

      {ingredients.length > 0 && (
        <section className="smoke grain sec" aria-labelledby="ig-h">
          <div className="wrap stack" style={{ gap: 'clamp(36px, 5vw, 64px)' }}>
            <div className="g12 rv" style={{ alignItems: 'end' }}>
              <div className="stack" style={{ gridColumn: '1 / span 7', gap: 18 }}>{ingr.eyebrow && <p className="label">{ingr.eyebrow}</p>}<h2 id="ig-h" className="d-xl"><Em text={ingr.title} /></h2></div>
              {ingr.body && <p className="muted" style={{ gridColumn: '8 / span 5' }}>{ingr.body}</p>}
            </div>
            <ul className="cols-4" style={{ listStyle: 'none' }}>
              {ingredients.map((g, i) => (
                <li key={g.id} className="stack rv" style={{ gap: 14 }}>
                  <Photo src={g.fields.imageUrl} art={g.fields.art} alt={g.title} focus={g.fields.focus || undefined} caption={false} decorative className="zoom" style={{ aspectRatio: '4 / 5' }} />
                  <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="d-s">{g.title}</h3>
                  {g.body && <p className="small muted">{g.body}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ImageBand src={cta.imageUrl} art={cta.fields.art || 'tanks'} direction="up" label="pc-h">
        <div className="stack rv" style={{ gap: 26, alignItems: 'flex-start' }}>
          <h2 id="pc-h" className="d-xl" style={{ maxWidth: '14ch' }}><Em text={cta.title} /></h2>
          <div className="row btn-row-m">
            <Link className="btn btn-copper" href="/visit-us">{cta.fields.cta || 'Visit Us'} <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link>
            <Link className="btn btn-ghost" href="/products">{cta.fields.cta2 || 'Explore Our Beers'}</Link>
          </div>
        </div>
      </ImageBand>
    </main>
  );
}
