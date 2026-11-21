import Link from 'next/link';
import { HeroCarousel } from '@/components/site/HeroCarousel';
import { Icon } from '@/components/site/Icons';
import { Lineup } from '@/components/site/Lineup';
import { ImageBand, Photo } from '@/components/site/Photo';
import { Em, Stop, SupplyNote } from '@/components/site/Text';
import { copy, getContent, getFeaturedProducts, getGalleryHome, getPageCopy, getSettings, mediaUrl } from '@/lib/api';

/** Asymmetric gallery-preview tiles (12-column spans / row spans). */
const TILES = [
  { gridColumn: '1 / span 7', gridRow: 'span 3' },
  { gridColumn: '8 / span 5', gridRow: 'span 2' },
  { gridColumn: '8 / span 2', gridRow: 'span 2' },
  { gridColumn: '10 / span 3', gridRow: 'span 2' },
  { gridColumn: '1 / span 7', gridRow: 'span 1' },
];
const THEMES = [
  { t: 'Ingredients', d: 'Every beer starts with water, malt, hops and yeast. Choosing them well, and treating them with respect, shapes everything that follows.', art: 'ingredients', alt: 'Hop cones and malted grain on a wooden surface' },
  { t: 'Brewing craftsmanship', d: 'Brewing is part science, part instinct: heat, time and patience, guided by people who care how the beer turns out.', art: 'tanks', alt: 'Stainless steel fermentation tanks under warm pendant lights' },
  { t: 'Attention to detail', d: 'Colour, clarity, aroma, the head on the pour. Small things, noticed and adjusted, add up to a beer with character.', art: 'flight', alt: 'A flight of four beers on a wooden paddle' },
];

export default async function HomePage() {
  const [settings, pc, slides, featured, gallery] = await Promise.all([getSettings(), getPageCopy(), getContent('hero_slide'), getFeaturedProducts(), getGalleryHome()]);
  const hero = copy(pc, 'home_hero');
  const intro = copy(pc, 'home_intro');
  const prod = copy(pc, 'home_products');
  const exp = copy(pc, 'home_experience');
  const phil = copy(pc, 'home_philosophy');
  const gal = copy(pc, 'home_gallery');
  const visit = copy(pc, 'home_visit');

  return (
    <main id="main">
      {/* 1 · IMMERSIVE HERO */}
      <HeroCarousel enabled={settings.autoMotion} slides={slides.map((s) => ({ src: s.fields.imageUrl ?? null, art: s.fields.art ?? 'tanks', alt: s.fields.alt || s.title, caption: s.title }))}>
        <div className="stack" style={{ gap: 26, maxWidth: 980 }}>
          {hero.eyebrow && <p className="label in">{hero.eyebrow}</p>}
          <h1 className="d-hero in d1"><Stop text={hero.title || 'Crafted with character.'} /></h1>
          {hero.body && <p className="lead in d2" style={{ color: 'var(--oat)', maxWidth: '34em' }}>{hero.body}</p>}
          <div className="row btn-row-m in d3" style={{ gap: 14 }}>
            <Link className="btn btn-copper" href="/products">{hero.fields.cta || 'Explore Our Beers'} <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link>
            <Link className="btn btn-ghost" href="/our-story">{hero.fields.cta2 || 'Discover Our Brewery'}</Link>
          </div>
        </div>
      </HeroCarousel>

      {/* 2 · BRAND INTRODUCTION */}
      <section id="intro" className="light grain sec" aria-labelledby="intro-h" style={{ overflow: 'hidden', scrollMarginTop: 60 }}>
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="rv" style={{ gridColumn: '1 / span 5', position: 'relative' }}>
            <Photo src={intro.imageUrl} art={intro.fields.art || 'kettle'} alt={intro.alt || 'The brewhouse'} className="zoom" corners style={{ aspectRatio: '4 / 5' }} />
            <p aria-hidden="true" style={{ position: 'absolute', right: -36, bottom: -28, font: '400 clamp(4rem, 9vw, 8rem)/.8 var(--fd)', color: 'transparent', WebkitTextStroke: '1px var(--copper-d)', opacity: 0.5, pointerEvents: 'none' }}>{settings.city} · {settings.region}</p>
          </div>
          <div className="stack rv" style={{ gridColumn: '7 / span 6', gap: 26 }}>
            {intro.eyebrow && <p className="label">{intro.eyebrow}</p>}
            <h2 id="intro-h" className="d-l"><Em text={intro.title} /></h2>
            {intro.body && <p className="lead">{intro.body}</p>}
            <SupplyNote note={intro.clientNote} tag="Brand introduction to be supplied" />
            <Link className="tlink" href="/our-story" style={{ alignSelf: 'flex-start' }}><span>{intro.fields.cta || 'Read Our Story'}</span><Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* 3 · FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="dark grain sec" aria-labelledby="feat-h">
          <div className="wrap stack" style={{ gap: 'clamp(36px, 5vw, 64px)' }}>
            <div className="between rv">
              <div className="stack" style={{ gap: 18 }}>
                {prod.eyebrow && <p className="label">{prod.eyebrow}</p>}
                <h2 id="feat-h" className="d-xl"><Em text={prod.title} /></h2>
              </div>
              <div className="stack" style={{ gap: 12, alignItems: 'flex-end' }}>
                {featured.some((p) => p.isSample) && <span className="tbs">Sample products · names &amp; specs to be supplied</span>}
                <Link className="tlink" href="/products"><span>{prod.fields.cta || 'Explore All Products'}</span><Icon name="arrow" /></Link>
              </div>
            </div>
            <Lineup products={featured} />
          </div>
        </section>
      )}

      {/* 4 · THE BREWERY EXPERIENCE */}
      <section aria-labelledby="exp-h" style={{ position: 'relative', background: 'var(--smoke)' }}>
        <Photo src={exp.imageUrl} art={exp.fields.art || 'taproom'} alt={exp.alt || 'The brewery'} caption="Brewery photo to be supplied" imgClass={settings.autoMotion ? 'pan' : ''} style={{ height: 'clamp(520px, 52vw, 820px)' }} />
        <div className="wrap" style={{ position: 'relative', marginTop: 'clamp(-220px, -14vw, -120px)', paddingBottom: 'clamp(64px, 8vw, 120px)' }}>
          <div className="light grain stack rv" style={{ marginLeft: 'auto', width: 'min(640px, 100%)', padding: 'clamp(28px, 4.5vw, 64px)', gap: 22, boxShadow: '0 30px 80px -30px rgba(0,0,0,.7)' }}>
            {exp.eyebrow && <p className="label">{exp.eyebrow}</p>}
            <h2 id="exp-h" className="d-l"><Em text={exp.title} /></h2>
            {exp.body && <p>{exp.body}</p>}
            {exp.clientNote && <p className="small"><span className="tbs">{exp.clientNote}</span></p>}
            <div className="row btn-row-m"><Link className="btn btn-dark" href="/visit-us">{exp.fields.cta || 'Plan Your Visit'} <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link></div>
          </div>
        </div>
      </section>

      {/* 5 · BREWING PHILOSOPHY */}
      <section className="smoke grain sec" aria-labelledby="phil-h">
        <div className="wrap stack" style={{ gap: 'clamp(48px, 6vw, 88px)' }}>
          <div className="g12 rv" style={{ alignItems: 'end' }}>
            <div className="stack" style={{ gridColumn: '1 / span 8', gap: 18 }}>
              {phil.eyebrow && <p className="label">{phil.eyebrow}</p>}
              <h2 id="phil-h" className="d-xl"><Em text={phil.title} /></h2>
            </div>
            <div className="stack" style={{ gridColumn: '9 / span 4', gap: 16 }}>
              {phil.body && <p className="muted">{phil.body}</p>}
              <Link className="tlink" href="/brewing-process" style={{ alignSelf: 'flex-start' }}><span>{phil.fields.cta || 'Discover Our Process'}</span><Icon name="arrow" /></Link>
            </div>
          </div>
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
            {THEMES.map((t, i) => (
              <li key={t.t} className="g12 rv" style={{ alignItems: 'center', paddingBlock: 36, borderTop: '1px solid var(--line-d)', borderBottom: i === THEMES.length - 1 ? '1px solid var(--line-d)' : undefined }}>
                <span className="idx" aria-hidden="true" style={{ gridColumn: '1 / span 2' }}>{String(i + 1).padStart(2, '0')}</span>
                <div className="stack" style={{ gridColumn: '3 / span 5', gap: 12 }}><h3 className="d-m">{t.t}</h3><p className="muted">{t.d}</p></div>
                <Photo art={t.art} alt={t.alt} caption={false} className="zoom" style={{ gridColumn: '9 / span 4', aspectRatio: '16 / 10' }} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="dark grain sec" aria-labelledby="gal-h">
          <div className="wrap stack" style={{ gap: 'clamp(32px, 4vw, 56px)' }}>
            <div className="between rv">
              <div className="stack" style={{ gap: 18 }}>{gal.eyebrow && <p className="label">{gal.eyebrow}</p>}<h2 id="gal-h" className="d-xl"><Em text={gal.title} /></h2></div>
              <Link className="tlink" href="/gallery"><span>{gal.fields.cta || 'Explore the Gallery'}</span><Icon name="arrow" /></Link>
            </div>
            <div className="g12" style={{ gridAutoRows: 'clamp(120px, 12vw, 190px)' }}>
              {gallery.slice(0, 5).map((g, i) => (
                <Link key={g.id} href="/gallery" className="rv" style={{ ...TILES[i], display: 'block' }} aria-label={`${g.title}: open the gallery`}>
                  <Photo src={g.imageUrl} art={g.art} alt={g.alt} focus={g.focus} caption={false} decorative className="zoom" style={{ height: '100%' }}>
                    <span className="cap">{g.title}</span>
                  </Photo>
                </Link>
              ))}
            </div>
            {gallery.some((g) => !mediaUrl(g.imageUrl)) && <p className="xs muted">Illustrated stand-ins are shown until The Craft Brewery supplies real photography.</p>}
          </div>
        </section>
      )}

      {/* 7 · VISIT CTA */}
      <ImageBand src={visit.imageUrl} art={visit.fields.art || 'exterior'} label="visit-h">
        <div className="stack rv" style={{ gap: 28, maxWidth: 820 }}>
          {visit.eyebrow && <p className="label">{visit.eyebrow}</p>}
          <h2 id="visit-h" className="d-xl"><Em text={visit.title} /></h2>
          <div className="cols-3" style={{ gap: 28, paddingBlock: 28, borderBlock: '1px solid var(--line-d)' }}>
            <div className="stack" style={{ gap: 8 }}><p className="meta">Address</p><a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '1.05rem' }}>{settings.addressLine1}<br />{settings.city}, {settings.region} {settings.postalCode}, {settings.country}<span className="sr-only"> (opens Google Maps)</span></a></div>
            <div className="stack" style={{ gap: 8 }}>
              <p className="meta">Opening hours</p>
              {settings.hoursVerified && settings.openStatus ? <span className={`open-pill ${settings.openStatus.isOpen ? '' : 'closed'}`} style={{ alignSelf: 'flex-start' }}>{settings.openStatus.label}</span> : <span className="tbs" style={{ alignSelf: 'flex-start' }}>Hours to be confirmed</span>}
            </div>
            <div className="stack" style={{ gap: 6 }}>
              <p className="meta">Contact</p>
              {settings.emailHref && <a href={settings.emailHref} style={{ textDecoration: 'none', wordBreak: 'break-all' }}>{settings.email}</a>}
              {settings.phoneHref && <a href={settings.phoneHref} style={{ textDecoration: 'none' }}>{settings.phone}</a>}
            </div>
          </div>
          <div className="row btn-row-m">
            <a className="btn btn-copper" href={settings.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <Icon name="ext" size={14} sw={2.4} /><span className="sr-only">(opens Google Maps)</span></a>
            <Link className="btn btn-ghost" href="/visit-us">Visit Us</Link>
          </div>
        </div>
      </ImageBand>
    </main>
  );
}
