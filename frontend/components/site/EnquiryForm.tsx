'use client';

import Link from 'next/link';
import type { EnquiryReceipt } from '@/lib/types';
import { ENQUIRY_LABELS, ENQUIRY_ORDER, ENQUIRY_TYPES, type EnquiryFields, MESSAGE_MAX, validateEnquiry } from '@/lib/validation';
import { Icon } from './Icons';
import { FieldError, useInquiryForm } from './useInquiryForm';

/**
 * Visit Us enquiry form. Success is shown only after the API confirms the save (201), and never implies a booked visit.
 * Spam protection: hidden honeypot field + server-side rate limit and duplicate check.
 */
export function EnquiryForm({ directionsUrl, storeEmail }: { directionsUrl: string; storeEmail: string | null }) {
  const form = useInquiryForm<EnquiryFields, EnquiryReceipt>({
    initial: { name: '', email: '', phone: '', enquiryType: '', message: '', consent: '', website: '' },
    order: ENQUIRY_ORDER,
    endpoint: '/inquiries',
    validate: validateEnquiry,
    toBody: (f) => ({ ...f, consent: f.consent === 'yes' }),
  });
  const f = form.f;

  if (form.status === 'success' && form.receipt) {
    const r = form.receipt;
    return (
      <div className="stack" style={{ gap: 18 }} role="status">
        <span style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', background: 'var(--char)', color: 'var(--copper-l)' }}><Icon name="check" size={26} sw={2.4} /></span>
        <h3 className="d-m">Thanks, {r.name.split(' ')[0]}. Your enquiry is on its way.</h3>
        <p className="muted">We’ll reply to <b>{r.email}</b>. This doesn’t book a visit; we’ll confirm any details with you directly.</p>
        <p className="small">Reference: <b>{r.reference}</b></p>
        <div className="row btn-row-m">
          <a className="btn btn-dark" href={directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <Icon name="ext" size={14} sw={2.4} /></a>
          <Link className="btn btn-ghost" href="/products">Explore Our Beers</Link>
          <button type="button" className="tlink" onClick={form.reset}><span>Send another enquiry</span></button>
        </div>
      </div>
    );
  }

  const mailto = storeEmail ? `mailto:${storeEmail}?subject=${encodeURIComponent(`${f.enquiryType || 'Enquiry'} from the website`)}&body=${encodeURIComponent(`Hello The Craft Brewery,\n\n${f.message}\n\n${f.name}${f.phone ? `\n${f.phone}` : ''}`)}` : null;
  const consentErr = form.errFor('consent');

  return (
    <form className="form" noValidate onSubmit={form.onSubmit} aria-label="Visit enquiry" aria-busy={form.sending}>
      <p className="small muted">Fields marked * are required.</p>
      {form.submitted && form.bad.length > 0 && (
        <div className="notice n-err" role="alert" tabIndex={-1} ref={form.summaryRef}>
          <Icon name="alert" size={22} />
          <div className="stack small" style={{ gap: 6 }}>
            <b>Please check {form.bad.length === 1 ? '1 thing' : `${form.bad.length} things`}:</b>
            <ul style={{ paddingLeft: 18 }}>{form.bad.map((k) => <li key={String(k)}><a href={`#fld-${String(k)}`} style={{ color: 'inherit' }}>{ENQUIRY_LABELS[String(k)]}: {form.errFor(k)}</a></li>)}</ul>
          </div>
        </div>
      )}
      {(form.status === 'failure' || form.status === 'duplicate') && (
        <div className={`notice ${form.status === 'duplicate' ? 'n-warn' : 'n-err'}`} role="alert">
          <Icon name="alert" size={22} />
          <div className="stack small" style={{ gap: 8 }}>
            <b>{form.status === 'duplicate' ? 'Already received' : 'We couldn’t send your enquiry.'}</b>
            <p>{form.message || 'Your details are still in the form. Please try again, or email us directly.'}</p>
            {form.status === 'failure' && mailto && <a className="btn btn-copper btn-sm" href={mailto} style={{ alignSelf: 'flex-start' }}>Email Us Instead</a>}
          </div>
        </div>
      )}
      <div className="f2">
        <div className="field"><label htmlFor="fld-name">Name *</label><input className="input" autoComplete="name" required {...form.fieldProps('name')} /><FieldError id="name-err" msg={form.errFor('name')} /></div>
        <div className="field"><label htmlFor="fld-email">Email *</label><input className="input" type="email" autoComplete="email" required {...form.fieldProps('email')} /><FieldError id="email-err" msg={form.errFor('email')} /></div>
      </div>
      <div className="f2">
        <div className="field"><label htmlFor="fld-phone">Phone <span className="opt">(optional)</span></label><input className="input" type="tel" autoComplete="tel" {...form.fieldProps('phone')} /><FieldError id="phone-err" msg={form.errFor('phone')} /></div>
        <div className="field">
          <label htmlFor="fld-enquiryType">Enquiry type *</label>
          <select className="input" required {...form.fieldProps('enquiryType')}>
            <option value="">Choose one…</option>
            {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <FieldError id="enquiryType-err" msg={form.errFor('enquiryType')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="fld-message">Message *</label>
        <textarea className="input" rows={5} required maxLength={MESSAGE_MAX + 200} {...form.fieldProps('message')} />
        <div className="between" style={{ gap: 8 }}><FieldError id="message-err" msg={form.errFor('message')} /><span className="xs muted" style={{ marginLeft: 'auto' }}>{f.message.length} / {MESSAGE_MAX}</span></div>
      </div>
      <div className="field">
        <label className="check" htmlFor="fld-consent" style={{ textTransform: 'none', letterSpacing: 0, font: '400 .95rem/1.5 var(--fb)' }}>
          <input id="fld-consent" type="checkbox" checked={f.consent === 'yes'} onChange={(e) => form.set({ consent: e.target.checked ? 'yes' : '' })} aria-invalid={consentErr ? true : undefined} aria-describedby={consentErr ? 'consent-err' : undefined} />
          <span>I agree that The Craft Brewery may use these details to reply to my enquiry. *</span>
        </label>
        <FieldError id="consent-err" msg={consentErr} />
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="e-website">Website</label><input id="e-website" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => form.set({ website: e.target.value })} />
      </div>
      <div className="row btn-row-m" style={{ justifyContent: 'space-between' }}>
        <p className="xs muted" style={{ maxWidth: '26em' }}>Protected against spam. We only use your details to reply.</p>
        <button type="submit" className="btn btn-copper" disabled={form.sending} aria-busy={form.sending}>
          {form.sending ? <><span className="spin" aria-hidden="true" />Sending…</> : 'Send Enquiry'}
        </button>
      </div>
    </form>
  );
}
