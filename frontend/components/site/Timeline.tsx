'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';
import { Photo } from './Photo';

export interface Stage { id: number; title: string; body: string; more: string | null; src: string | null; art: string | null; focus: string }

/** Connected brewing timeline: the line fills and nodes light up as you scroll; each stage expands for more detail. */
export function Timeline({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        setProgress(Math.max(0, Math.min(1, (vh * 0.6 - r.top) / Math.max(1, r.height))));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);

  const n = stages.length;
  const active = Math.min(n - 1, Math.floor(progress * n));

  return (
    <>
      <p className="small muted" aria-live="polite" style={{ marginTop: -12 }}>Stage {active + 1} of {n} · {stages[active]?.title}</p>
      <div className="tl" ref={ref}>
        <div className="tl-line" aria-hidden="true"><div className="tl-fill" style={{ height: `${Math.round(progress * 100)}%` }} /></div>
        <ol style={{ listStyle: 'none' }}>
          {stages.map((s, i) => {
            const no = String(i + 1).padStart(2, '0');
            const isOpen = !!open[s.id];
            return (
              <li key={s.id} className={`stage ${i % 2 ? 'flip' : ''} ${i < active ? 'done' : i === active ? 'active' : ''}`}>
                <span className="node" aria-hidden="true">{no}</span>
                <Photo src={s.src} art={s.art} alt={s.title} focus={s.focus} className="zoom s-media" style={{ aspectRatio: '16 / 11', border: '1px solid var(--line-d)' }} />
                <div className="stack s-text" style={{ gap: 14, paddingInline: 'clamp(0px, 2vw, 24px)' }}>
                  <p className="meta">Stage {no}</p>
                  <h3 className="d-m">{s.title}</h3>
                  <p className="muted" style={{ maxWidth: '30em' }}>{s.body}</p>
                  {s.more && (
                    <>
                      <button type="button" className="tlink" aria-expanded={isOpen} aria-controls={`more-${s.id}`} onClick={() => setOpen((o) => ({ ...o, [s.id]: !isOpen }))}>
                        <span>{isOpen ? 'Less' : `More about ${s.title.toLowerCase()}`}</span><Icon name="chevD" size={16} style={{ transform: isOpen ? 'rotate(180deg)' : undefined }} />
                      </button>
                      <div id={`more-${s.id}`} className={`expand ${isOpen ? 'open' : ''}`} hidden={!isOpen}>
                        <div><p className="small" style={{ color: 'var(--oat)', maxWidth: '30em', paddingTop: 4 }}>{s.more}</p></div>
                      </div>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
