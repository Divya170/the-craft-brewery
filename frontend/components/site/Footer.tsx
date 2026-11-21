import Link from 'next/link';
import type { SiteSettings, Style } from '@/lib/types';
import { Icon, Wordmark } from './Icons';

export function Footer({ settings: s, styles }: { settings: SiteSettings; styles: Style[] }) {
  return (
    <footer className="ftr grain">
      <div className="wrap" style={{ paddingTop: 'clamp(64px, 8vw, 112px)', paddingBottom: 28 }}>
        <div className="between" style={{ alignItems: 'flex-end', paddingBottom: 'clamp(40px, 5vw, 64px)', marginBottom: 'clamp(40px, 5vw, 64px)', borderBottom: '1px solid var(--line-d)' }}>
          <p style={{ font: '400 clamp(3rem, 7vw, 6.6rem)/.88 var(--fd)', color: 'var(--white)', textTransform: 'uppercase', maxWidth: '12ch' }}>Come experience <span style={{ color: 'var(--copper-l)' }}>the craft.</span></p>
          <Link className="btn btn-copper" href="/visit-us">Plan Your Visit <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link>
        </div>
        <div className="ftr-grid">
          <div className="stack" style={{ gap: 18 }}>
            <Link className="brand" href="/" aria-label={`${s.businessName}, home`}><Wordmark /></Link>
            <p style={{ maxWidth: '32ch' }}>{s.footerNote}</p>
          </div>
          <nav aria-label="Footer">
            <h2>Explore</h2>
            <ul>{[['/', 'Home'], ['/products', 'Our Products'], ['/our-story', 'Our Story'], ['/brewing-process', 'Brewing Process'], ['/gallery', 'Gallery'], ['/visit-us', 'Visit Us']].map(([h, l]) => <li key={h}><Link href={h}>{l}</Link></li>)}</ul>
          </nav>
          {styles.length > 0 && (
            <nav aria-label="Beer styles">
              <h2>Our beers</h2>
              <ul>{styles.map((st) => <li key={st.slug}><Link href={`/products?style=${st.slug}`}>{st.pluralName}</Link></li>)}</ul>
            </nav>
          )}
          <div>
            <h2>Visit &amp; contact</h2>
            <address className="stack" style={{ fontStyle: 'normal', gap: 2 }}>
              <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ minHeight: 38, display: 'inline-flex', alignItems: 'center' }}>{s.addressLine1}, {s.city}, {s.region} {s.postalCode}<span className="sr-only"> (opens Google Maps)</span></a>
              {s.emailHref && <a href={s.emailHref} style={{ minHeight: 38, display: 'inline-flex', alignItems: 'center', wordBreak: 'break-all' }}>{s.email}</a>}
              {s.phoneHref && <a href={s.phoneHref} style={{ minHeight: 38, display: 'inline-flex', alignItems: 'center' }}>{s.phone}</a>}
            </address>
            {s.hoursVerified && s.openStatus && <p className="small" style={{ marginTop: 10, color: 'var(--white)' }}>{s.openStatus.label}</p>}
            {s.socialLinks.length > 0 && (
              <ul style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 10 }} aria-label="Social media">
                {s.socialLinks.map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
              </ul>
            )}
          </div>
        </div>
        <div className="between" style={{ marginTop: 'clamp(40px, 6vw, 72px)', paddingTop: 22, borderTop: '1px solid var(--line-d)', alignItems: 'center', fontSize: '.82rem', color: 'var(--mute-d)' }}>
          <p>© {new Date().getFullYear()} {s.businessName}. All rights reserved.</p>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Icon name="minus" sw={1.8} />For adults 21 and over. Please enjoy responsibly and never drink and drive.</p>
          {(s.privacyUrl || s.termsUrl) && (
            <p className="row" style={{ gap: 18 }}>
              {s.privacyUrl && <a href={s.privacyUrl}>Privacy policy</a>}
              {s.termsUrl && <a href={s.termsUrl}>Terms</a>}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
