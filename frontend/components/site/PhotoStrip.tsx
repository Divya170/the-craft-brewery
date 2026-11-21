'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { artUrl, mediaUrl } from '@/lib/api';
import { PlayPause } from './Icons';
import { useReducedMotion } from './useMotion';

export interface StripPhoto { src: string | null; art: string | null; alt: string; ratio: string; focus: string }

/** A slow horizontal photo strip (Our Story). Pausable, stops on hover/focus, static for reduced motion or when Living imagery is off. */
export function PhotoStrip({ photos, enabled, title }: { photos: StripPhoto[]; enabled: boolean; title: React.ReactNode }) {
  const rm = useReducedMotion();
  const [paused, setPaused] = useState(!enabled);
  const moving = enabled && !rm;
  const doubled = photos.concat(photos);
  return (
    <>
      <div className="wrap between" style={{ alignItems: 'center', marginBottom: 32 }}>
        {title}
        {moving && <button type="button" className="icon-btn" aria-pressed={paused} aria-label={paused ? 'Play moving photos' : 'Pause moving photos'} onClick={() => setPaused((p) => !p)}><PlayPause paused={paused} /></button>}
      </div>
      <div className={`strip-wrap ${paused || !moving ? 'paused' : ''}`} tabIndex={0} role="region" aria-label="Brewery photos">
        <div className="strip" style={moving ? undefined : { animation: 'none', overflowX: 'auto' }}>
          {(moving ? doubled : photos).map((p, i) => {
            const real = mediaUrl(p.src);
            const dup = i >= photos.length;
            return (
              <figure key={i} className="ph" style={{ width: 'clamp(260px, 30vw, 460px)', aspectRatio: p.ratio, flex: '0 0 auto' }} aria-hidden={dup || undefined}>
                <img className={real ? 'photo' : 'art'} src={real ?? artUrl(p.art)} alt={dup ? '' : real ? p.alt : `Illustration: ${p.alt}`} loading="lazy" decoding="async" style={{ objectPosition: p.focus }} />
              </figure>
            );
          })}
        </div>
      </div>
    </>
  );
}
