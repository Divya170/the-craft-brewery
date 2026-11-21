import { AgeGate } from '@/components/site/AgeGate';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { BreweryJsonLd } from '@/components/site/Visit';
import { getSettings, getStyles } from '@/lib/api';
import { SITE_URL } from '@/lib/site';
import type { SiteSettings, Style } from '@/lib/types';
import { RetryButton } from './RetryButton';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings: SiteSettings | null = null;
  let styles: Style[] = [];
  try {
    [settings, styles] = await Promise.all([getSettings(), getStyles()]);
  } catch {
    settings = null;
  }

  if (!settings) {
    return (
      <main id="main" className="wrap not-found">
        <p className="label">The Craft Brewery</p>
        <h1 className="d-xl">We’ll be right back.</h1>
        <p className="lead">The website can’t load the brewery’s information right now. Please try again in a moment.</p>
        <RetryButton />
      </main>
    );
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="hdr-wrap"><Header settings={settings} /></div>
      {children}
      <Footer settings={settings} styles={styles} />
      <BreweryJsonLd settings={settings} url={SITE_URL} />
      {settings.ageGateEnabled && <AgeGate businessName={settings.businessName} />}
    </>
  );
}
