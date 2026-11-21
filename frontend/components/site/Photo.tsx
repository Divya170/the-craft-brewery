/* eslint-disable @next/next/no-img-element */
import { artUrl, mediaUrl } from '@/lib/api';
import { Icon } from './Icons';

/**
 * A photo slot: the uploaded photo when there is one; otherwise the shipped illustration with a small
 * "photo to be supplied" caption, so a stand-in is never mistaken for the real brewery.
 */
export function Photo({ src, art, alt, caption = 'Photo to be supplied', className = '', imgClass = '', style, focus, priority, decorative, corners, children }: {
  src?: string | null; art?: string | null; alt: string; caption?: string | false; className?: string; imgClass?: string; style?: React.CSSProperties;
  focus?: string; priority?: boolean; decorative?: boolean; corners?: boolean; children?: React.ReactNode;
}) {
  const real = mediaUrl(src);
  const imgAlt = decorative ? '' : real ? alt : `Illustration: ${alt}`;
  return (
    <figure className={`ph ${className}`} style={style}>
      <img className={`${real ? 'photo' : 'art'} ${imgClass}`} src={real ?? artUrl(art)} alt={imgAlt} loading={priority ? 'eager' : 'lazy'} decoding="async" style={focus ? { objectPosition: focus } : undefined} />
      {corners && <><span className="corner tl" aria-hidden="true" /><span className="corner br" aria-hidden="true" /></>}
      {!real && caption && <figcaption className="cap"><Icon name="image" size={11} sw={2.4} />{caption}</figcaption>}
      {children}
    </figure>
  );
}

/** Full-bleed image band with a dark gradient, used by every closing call-to-action. */
export function ImageBand({ src, art, children, direction = 'side', label }: { src?: string | null; art?: string | null; children: React.ReactNode; direction?: 'side' | 'up'; label: string }) {
  const real = mediaUrl(src);
  return (
    <section aria-labelledby={label} style={{ position: 'relative', overflow: 'hidden', background: 'var(--smoke)' }}>
      <img src={real ?? artUrl(art)} alt="" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: direction === 'side' ? 'linear-gradient(90deg, rgba(21,22,20,.95), rgba(21,22,20,.45))' : 'linear-gradient(0deg, rgba(21,22,20,.95), rgba(21,22,20,.5))' }} />
      <div className="wrap sec" style={{ position: 'relative' }}>{children}</div>
    </section>
  );
}
