'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { artUrl, mediaUrl } from '@/lib/api';
import { Icon, PlayPause } from './Icons';
import { useReducedMotion, useTabHidden } from './useMotion';

export interface HeroSlide { src: string | null; art: string | null; alt: string; caption: string }

/**
 * Homepage hero images: a 7-second cross-fade over a slow zoom, with previous/next, dots and a pause button.
 * Pauses on hover, keyboard focus, hidden tabs and manual navigation; still for reduced motion or when Living imagery is off.
 */
export function HeroCarousel({ slides, enabled, children }: { slides: HeroSlide[]; enabled: boolean; children: React.ReactNode }) {
  const rm = useReducedMotion();
  const hidden = useTabHidden();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const hold = useRef(false);
  const list = slides.length ? slides : [{ src: null, art: 'tanks', alt: 'The brewhouse', caption: 'The brewhouse' }];
  const auto = enabled && !rm && list.length > 1;

  useEffect(() => {
    if (!auto || paused || hidden) return;
    const t = setInterval(() => { if (!hold.current) setI((n) => (n + 1) % list.length); }, 7000);
    return () => clearInterval(t);
  }, [auto, paused, hidden, list.length]);

  const go = (n: number) => { setI((n + list.length) % list.length); setPaused(true); };
  const cur = list[i];
  const anyStandIn = list.some((s) => !s.src);

  return (
    <section className={`hero ${auto && !paused ? '' : 'paused'}`} aria-roledescription="carousel" aria-label="The brewery"
      onMouseEnter={() => { hold.current = true; }} onMouseLeave={() => { hold.current = false; }} onFocus={() => { hold.current = true; }} onBlur={() => { hold.current = false; }}>
      <div className="slides">
        {list.map((s, n) => {
          const real = mediaUrl(s.src);
          return (
            <div key={n} className={`slide ${n === i ? 'on' : ''}`} aria-hidden={n === i ? undefined : true}>
              <img className={enabled && !rm ? 'kb' : ''} src={real ?? artUrl(s.art)} alt={n === i ? (real ? s.alt : `Illustration: ${s.alt}`) : ''} loading={n === 0 ? 'eager' : 'lazy'} decoding="async" />
            </div>
          );
        })}
      </div>
      <div className="shade" aria-hidden="true" />
      <div className="wrap hero-body" style={{ width: '100%' }}>
        {children}
        <div className="between in d4" style={{ marginTop: 'clamp(48px, 7vw, 96px)', paddingTop: 22, borderTop: '1px solid var(--line-d)', alignItems: 'center' }}>
          <a className="scroll-cue" href="#intro"><i aria-hidden="true" />Scroll</a>
          <p className="xs muted" aria-live={paused || !auto ? 'polite' : 'off'} style={{ letterSpacing: '.14em', textTransform: 'uppercase' }}>
            {String(i + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')} · {cur.caption}{anyStandIn && !cur.src && <> · <span style={{ color: 'var(--brass)' }}>photo to be supplied</span></>}
          </p>
          {list.length > 1 && (
            <div className="row" style={{ gap: 8 }} role="group" aria-label="Hero image controls">
              <button type="button" className="icon-btn" aria-label="Previous image" onClick={() => go(i - 1)}><Icon name="chevL" /></button>
              <div className="dots">{list.map((_, n) => <button key={n} type="button" aria-label={`Show image ${n + 1}`} aria-current={n === i ? 'true' : undefined} onClick={() => go(n)}><span /></button>)}</div>
              <button type="button" className="icon-btn" aria-label="Next image" onClick={() => go(i + 1)}><Icon name="chevR" /></button>
              {auto && <button type="button" className="icon-btn" aria-pressed={paused} aria-label={paused ? 'Play hero images' : 'Pause hero images'} onClick={() => setPaused((p) => !p)}><PlayPause paused={paused} /></button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
