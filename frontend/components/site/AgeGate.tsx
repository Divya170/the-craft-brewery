'use client';

import { useEffect, useRef, useState } from 'react';
import { HopMark } from './Icons';

const KEY = 'tcb_age_ok';
const DAYS = 30;

/**
 * 21+ confirmation, shown once and remembered on this device for 30 days (a timestamp in localStorage; no personal data).
 * Keyboard: focus moves into the dialog and Tab stays inside it until answered. Not proof of legal compliance.
 */
export function AgeGate({ businessName }: { businessName: string }) {
  const [state, setState] = useState<'checking' | 'ask' | 'no' | 'ok'>('checking');
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ok = false;
    try { const v = Number(window.localStorage.getItem(KEY)); ok = !!v && Date.now() - v < DAYS * 864e5; } catch { ok = false; }
    setState(ok ? 'ok' : 'ask');
  }, []);

  useEffect(() => {
    if (state !== 'ask' && state !== 'no') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector<HTMLElement>('button, a');
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel.current) return;
      const els = Array.from(panel.current.querySelectorAll<HTMLElement>('button, a'));
      if (!els.length) return;
      const [a, z] = [els[0], els[els.length - 1]];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', trap); };
  }, [state]);

  if (state === 'checking' || state === 'ok') return null;

  const yes = () => { try { window.localStorage.setItem(KEY, String(Date.now())); } catch { /* storage blocked: answer applies to this visit only */ } setState('ok'); };

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-h" aria-describedby="gate-d">
      <div className="gate-panel grain" ref={panel}>
        <HopMark size={56} />
        {state === 'ask' ? (
          <div className="stack" style={{ gap: 20, alignItems: 'center' }}>
            <p className="label plain">{businessName} · Bend, Oregon</p>
            <h2 id="gate-h" className="d-l">Are you 21 <em>or older?</em></h2>
            <p id="gate-d" className="muted" style={{ maxWidth: '30em' }}>This website is about beer and is intended for adults of legal drinking age.</p>
            <div className="row btn-row-m" style={{ justifyContent: 'center', width: '100%' }}>
              <button type="button" className="btn btn-copper" onClick={yes}>Yes, I’m 21 or older</button>
              <button type="button" className="btn btn-ghost" onClick={() => setState('no')}>No, I’m not</button>
            </div>
            <p className="xs muted">We’ll remember your answer on this device for {DAYS} days. No personal data is stored.</p>
          </div>
        ) : (
          <div className="stack" style={{ gap: 20, alignItems: 'center' }} role="status">
            <h2 id="gate-h" className="d-l">Come back when <em>you’re 21.</em></h2>
            <p id="gate-d" className="muted" style={{ maxWidth: '30em' }}>You must be of legal drinking age to view this website. Thanks for stopping by.</p>
            <a className="btn btn-ghost" href="https://www.responsibility.org/">Leave this site</a>
            <button type="button" className="tlink" onClick={() => setState('ask')}><span>I answered by mistake</span></button>
          </div>
        )}
      </div>
    </div>
  );
}
