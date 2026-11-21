'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import { Icon, Wordmark } from './Icons';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Our Products' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/brewing-process', label: 'Brewing Process' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/visit-us', label: 'Visit Us' },
];

/** Transparent over each page's dark hero, then solid smoked black once scrolled. "Plan Your Visit" is always one click away. */
export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname() ?? '/';
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open]);

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header className={`hdr ${solid ? 'solid' : 'overlay'}`}>
        <div className="wrap hdr-in">
          <Link className="brand" href="/" aria-label={`${settings.businessName}, home`}><Wordmark /></Link>
          <nav className="nav" aria-label="Main">
            {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}>{n.label}</Link>)}
          </nav>
          <Link className="btn btn-copper btn-sm hdr-cta" href="/visit-us">Plan Your Visit</Link>
          <button ref={btn} type="button" className="icon-btn menu-btn" style={{ marginLeft: 'auto' }} aria-label="Open menu" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
            <Icon name="menu" size={22} sw={1.8} />
          </button>
        </div>
      </header>
      {open && (
        <div className="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Site menu">
          <button type="button" className="scrim" tabIndex={-1} aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="drawer-panel grain">
            <div className="between" style={{ alignItems: 'center' }}>
              <span className="brand"><span className="wm"><small>The</small><b>Craft Brewery</b></span></span>
              <button type="button" className="icon-btn" aria-label="Close menu" autoFocus onClick={() => { setOpen(false); btn.current?.focus(); }}><Icon name="close" size={20} sw={1.8} /></button>
            </div>
            <nav aria-label="Main (mobile)">
              {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined} onClick={() => setOpen(false)}><span>{n.label}</span><Icon name="arrow" size={22} sw={1.6} /></Link>)}
            </nav>
            <Link className="btn btn-copper" href="/visit-us" onClick={() => setOpen(false)}>Plan Your Visit</Link>
            <div className="stack small" style={{ gap: 4, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--line-d)', color: 'var(--oat)' }}>
              <span>{settings.fullAddress}</span>
              {settings.emailHref && <a href={settings.emailHref} style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>{settings.email}</a>}
              <span className="xs muted">For adults 21+. Please drink responsibly.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
