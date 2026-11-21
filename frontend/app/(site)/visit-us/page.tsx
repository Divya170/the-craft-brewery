import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyAddress } from '@/components/site/CopyAddress';
import { EnquiryForm } from '@/components/site/EnquiryForm';
import { Icon } from '@/components/site/Icons';
import { ImageBand, Photo } from '@/components/site/Photo';
import { Em, Stop } from '@/components/site/Text';
import { HoursTable, MapPanel } from '@/components/site/Visit';
import { copy, getContent, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Visit Us',
  description: 'Find The Craft Brewery at 4827 Aspen Street, Bend, Oregon. Directions, contact details and visit enquiries.',
  alternates: { canonical: '/visit-us' },
};

export default async function VisitPage() {
  const [s, pc, info] = await Promise.all([getSettings(), getPageCopy(), getContent('visitor_info')]);
  const hero = copy(pc, 'visit_hero');
  const vi = copy(pc, 'visit_info');
  const enq = copy(pc, 'visit_enquiry');
  const cta = copy(pc, 'visit_cta');

  return (
    <main id="main">
      <section className="dark grain" aria-labelledby="vu-h" style={{ position: 'relative', minHeight: 'min(78vh, 760px)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Photo src={hero.imageUrl} art={hero.fields.art || 'exterior'} alt={hero.alt} caption={false} priority decorative style={{ position: 'absolute', inset: 0 }} />
        <div className="shade" aria-hidden="true" />
        <div className="wrap stack" style={{ position: 'relative', gap: 22, paddingBlock: '160px clamp(48px, 7vw, 96px)' }}>
          {hero.eyebrow && <p className="label in">{hero.eyebrow}</p>}
          <h1 id="vu-h" className="d-hero in d1"><Stop text={hero.title} /></h1>
          {hero.body && <p className="lead in d2" style={{ color: 'var(--oat)' }}>{hero.body}</p>}
        </div>
      </section>

      <section className="light grain sec" aria-labelledby="find-h">
        <div className="wrap g12" style={{ alignItems: 'start', rowGap: 48 }}>
          <div className="stack" style={{ gridColumn: '1 / span 6', gap: 36 }}>
            <div className="stack" style={{ gap: 14 }}>
              <p className="label">Find us</p>
              <h2 id="find-h" className="d-l">{s.addressLine1}<br /><em>{s.city}, {s.region} {s.postalCode}</em></h2>
              <p className="muted">{s.country}</p>
              <div className="row btn-row-m" style={{ gap: 12 }}>
                <a className="btn btn-dark" href={s.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <Icon name="ext" size={14} sw={2.4} /><span className="sr-only">(opens Google Maps)</span></a>
                <CopyAddress text={s.fullAddress} />
              </div>
            </div>
            <div className="stack info" style={{ gap: 14 }}>
              <p className="label">Contact</p>
              {s.emailHref && <p className="row" style={{ gap: 10 }}><Icon name="mail" /><a href={s.emailHref} style={{ wordBreak: 'break-all' }}>{s.email}</a></p>}
              {s.phone && (
                <div className="stack" style={{ gap: 6 }}>
                  <p className="row" style={{ gap: 10 }}><Icon name="phone" />{s.phoneVerified && s.phoneHref ? <a href={s.phoneHref}>{s.phone}</a> : <span>{s.phone}</span>}</p>
                  {!s.phoneVerified && <p className="small"><span className="tbs" style={{ whiteSpace: 'normal' }}>Phone number awaiting confirmation. Please email for now.</span></p>}
                </div>
              )}
            </div>
            <HoursTable settings={s} />
          </div>
          <div style={{ gridColumn: '8 / span 5' }}><MapPanel settings={s} /></div>
        </div>
      </section>

      {info.length > 0 && (
        <section className="smoke grain sec" aria-labelledby="vi-h">
          <div className="wrap stack" style={{ gap: 'clamp(32px, 4vw, 56px)' }}>
            <div className="g12" style={{ alignItems: 'end' }}>
              <div className="stack" style={{ gridColumn: '1 / span 7', gap: 18 }}>{vi.eyebrow && <p className="label">{vi.eyebrow}</p>}<h2 id="vi-h" className="d-xl"><Em text={vi.title} /></h2></div>
              {vi.body && <p className="muted" style={{ gridColumn: '8 / span 5' }}>{vi.body}</p>}
            </div>
            <dl className="cols-3">
              {info.map((it) => (
                <div key={it.id} className="stack" style={{ gap: 10, paddingTop: 20, borderTop: '1px solid var(--line-d)' }}>
                  <dt className="d-s">{it.title}</dt>
                  <dd className="stack" style={{ gap: 10 }}>
                    {it.body && <p className="small muted">{it.body}</p>}
                    {it.fields.clientNote && <span className="tbs" style={{ alignSelf: 'flex-start' }}>{it.fields.clientNote}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section id="enquiry" className="oat grain sec" aria-labelledby="enq-h" style={{ scrollMarginTop: 80 }}>
        <div className="wrap g12" style={{ alignItems: 'start', rowGap: 36 }}>
          <div className="stack" style={{ gridColumn: '1 / span 5', gap: 18 }}>
            {enq.eyebrow && <p className="label">{enq.eyebrow}</p>}
            <h2 id="enq-h" className="d-xl"><Em text={enq.title} /></h2>
            {enq.body && <p>{enq.body}</p>}
          </div>
          <div style={{ gridColumn: '7 / span 6' }}><EnquiryForm directionsUrl={s.directionsUrl} storeEmail={s.email} /></div>
        </div>
      </section>

      <ImageBand src={cta.imageUrl} art={cta.fields.art || 'taproom'} label="vc-h">
        <div className="stack" style={{ gap: 26, maxWidth: 760 }}>
          <h2 id="vc-h" className="d-xl"><Em text={cta.title} /></h2>
          <div className="row btn-row-m">
            <a className="btn btn-copper" href={s.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <Icon name="ext" size={14} sw={2.4} /></a>
            <Link className="btn btn-ghost" href="/products">Explore Our Beers</Link>
          </div>
        </div>
      </ImageBand>
    </main>
  );
}
