import type { SiteSettings } from '@/lib/types';

/** Opening hours: an editable placeholder until staff mark them confirmed. No "open now" status before that. */
export function HoursTable({ settings }: { settings: SiteSettings }) {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="between" style={{ alignItems: 'center' }}>
        <p className="label">Opening hours</p>
        {settings.hoursVerified && settings.openStatus
          ? <span className={`open-pill ${settings.openStatus.isOpen ? '' : 'closed'}`}>{settings.openStatus.label}</span>
          : <span className="tbs">To be confirmed</span>}
      </div>
      <table className="hours">
        <caption className="sr-only">Opening hours{settings.hoursVerified ? '' : ' (to be confirmed)'}</caption>
        <tbody>
          {settings.hoursDisplay.map((d) => (
            <tr key={d.day} className={settings.hoursVerified && d.isToday ? 'today' : ''}>
              <th scope="row">{d.day}{settings.hoursVerified && d.isToday && <span className="sr-only"> (today)</span>}</th>
              <td>{settings.hoursVerified ? d.label : '[Hours to be confirmed]'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!settings.hoursVerified && <p className="small muted">Until hours are confirmed, please email{settings.phoneHref ? ' or call' : ''} before visiting.</p>}
    </div>
  );
}

/** Live Google Maps embed (Settings → map embed URL), with a link-out fallback if it's cleared. */
export function MapPanel({ settings }: { settings: SiteSettings }) {
  if (settings.mapEmbedUrl) {
    return (
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#D9CFBD' }}>
        <iframe className="map-frame" src={settings.mapEmbedUrl} title={`Map showing ${settings.businessName}, ${settings.fullAddress}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    );
  }
  return (
    <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Map of ${settings.fullAddress}. Opens Google Maps in a new tab.`} style={{ display: 'grid', placeItems: 'center', aspectRatio: '1 / 1', background: 'var(--oat)', color: 'var(--char)', textDecoration: 'none' }}>
      <span className="btn btn-dark">Open in Google Maps ↗</span>
    </a>
  );
}

/**
 * LocalBusiness (Brewery) structured data with VERIFIED information only: phone appears only once marked verified,
 * opening hours only once confirmed. No ratings, reviews or invented attributes.
 */
export function BreweryJsonLd({ settings: s, url }: { settings: SiteSettings; url: string }) {
  const DAY: Record<string, string> = { Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th', Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su' };
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Brewery',
    name: s.businessName,
    url,
    address: { '@type': 'PostalAddress', streetAddress: s.addressLine1, addressLocality: s.city, addressRegion: s.region, postalCode: s.postalCode, addressCountry: 'US' },
  };
  if (s.email) data.email = s.email;
  if (s.phone && s.phoneVerified) data.telephone = s.phone;
  if (s.hoursVerified) {
    data.openingHours = s.hours.filter((h) => !h.closed && h.open && h.close).map((h) => `${DAY[h.day]} ${h.open}-${h.close}`);
  }
  if (s.socialLinks.length) data.sameAs = s.socialLinks.map((l) => l.url);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
