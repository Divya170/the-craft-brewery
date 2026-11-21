'use client';

import { useRef, useState } from 'react';
import { ApiError, apiFetch } from '@/lib/api';

type Status = 'idle' | 'sending' | 'success' | 'failure' | 'duplicate';

/**
 * Shared state for the Visit Us enquiry form: client-side mirror validation, server field errors,
 * honeypot, sending / success / failure / duplicate states. Success is set ONLY from a 2xx API response.
 */
export function useInquiryForm<F extends { [K in keyof F]: string }, R>(opts: {
  initial: F; order: (keyof F)[]; endpoint: string; validate: (f: F) => Partial<Record<keyof F, string>>; toBody: (f: F) => unknown;
}) {
  const [f, setFState] = useState<F>(opts.initial);
  const [seen, setSeen] = useState<Partial<Record<keyof F, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof F, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState<R | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const clientErrors = opts.validate(f);
  const errFor = (k: keyof F) => serverErrors[k] || ((submitted || seen[k]) ? clientErrors[k] : '') || '';
  const bad = opts.order.filter((k) => errFor(k));

  const set = (patch: Partial<F>) => {
    setFState((p) => ({ ...p, ...patch }));
    setServerErrors((e) => { const n = { ...e }; for (const k of Object.keys(patch)) delete n[k as keyof F]; return n; });
    if (status === 'failure' || status === 'duplicate') setStatus('idle');
  };
  const onField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set({ [e.target.name]: e.target.value } as Partial<F>);
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setSeen((s) => ({ ...s, [e.target.name]: true }));

  const focusFirst = (errs: Partial<Record<keyof F, string>>) => {
    const first = opts.order.find((k) => errs[k]);
    if (first) setTimeout(() => document.getElementById(`fld-${String(first)}`)?.focus(), 0);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setSubmitted(true);
    const errs = opts.validate(f);
    if (opts.order.some((k) => errs[k])) { setStatus('idle'); focusFirst(errs); return; }
    setStatus('sending');
    setMessage('');
    try {
      const r = await apiFetch<R>(opts.endpoint, { method: 'POST', body: JSON.stringify(opts.toBody(f)) });
      setReceipt(r);
      setStatus('success');
    } catch (err) {
      const ae = err instanceof ApiError ? err : null;
      if (ae?.status === 400 && Object.keys(ae.fieldErrors).length) {
        setServerErrors(ae.fieldErrors as Partial<Record<keyof F, string>>);
        setStatus('idle');
        focusFirst(ae.fieldErrors as Partial<Record<keyof F, string>>);
        setTimeout(() => summaryRef.current?.focus(), 0);
      } else if (ae?.status === 409) {
        setStatus('duplicate');
        setMessage(ae.message);
      } else {
        setStatus('failure');
        setMessage(ae?.status === 429 ? ae.message : ae?.status === 0 ? 'We couldn’t reach the brewery’s server. Check your connection and try again.' : '');
      }
    }
  }

  const reset = () => { setFState(opts.initial); setSeen({}); setSubmitted(false); setServerErrors({}); setStatus('idle'); setReceipt(null); setMessage(''); };
  const fieldProps = (k: keyof F, hint?: boolean) => {
    const err = errFor(k);
    return {
      id: `fld-${String(k)}`, name: String(k), value: f[k], onChange: onField, onBlur,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${String(k)}-err` : hint ? `${String(k)}-hint` : undefined,
    };
  };

  return { f, set, errFor, bad, submitted, status, message, receipt, onSubmit, reset, fieldProps, summaryRef, sending: status === 'sending' };
}

export function FieldError({ id, msg }: { id: string; msg: string }) {
  return msg ? <p id={id} className="err">{msg}</p> : null;
}
