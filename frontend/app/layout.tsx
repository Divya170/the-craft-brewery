import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Sans, DM_Serif_Display } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const display = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'The Craft Brewery · Craft brewery in Bend, Oregon', template: '%s · The Craft Brewery' },
  description: 'The Craft Brewery is a craft brewery at 4827 Aspen Street, Bend, Oregon. Explore the beers, the brewing process and plan your visit.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'The Craft Brewery', locale: 'en_US', url: '/', images: [{ url: '/art/tanks.svg', width: 1600, height: 1000, alt: 'The brewhouse' }] },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#151614' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
