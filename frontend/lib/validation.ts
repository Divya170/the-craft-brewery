/**
 * Browser-side mirror of backend/src/inquiries/inquiry-rules.ts, for instant feedback.
 * The API stays authoritative; `npm run test:rules` checks both give identical results.
 * (The form keeps the consent checkbox as 'yes' / '' and sends it to the API as a boolean.)
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ENQUIRY_TYPES = ['Planning a visit', 'Group visit', 'Our beers', 'General question', 'Other'] as const;
export const MESSAGE_MAX = 1500;

export interface EnquiryFields { name: string; email: string; phone: string; enquiryType: string; message: string; consent: string; website: string }
export const ENQUIRY_ORDER: (keyof EnquiryFields)[] = ['name', 'email', 'phone', 'enquiryType', 'message', 'consent'];
export const ENQUIRY_LABELS: Record<string, string> = { name: 'Name', email: 'Email', phone: 'Phone', enquiryType: 'Enquiry type', message: 'Message', consent: 'Consent' };

export function validateEnquiry(f: EnquiryFields) {
  const e: Partial<Record<keyof EnquiryFields, string>> = {};
  const name = f.name.trim();
  const email = f.email.trim();
  const phone = f.phone.trim();
  const message = f.message.trim();
  if (name.length < 2) e.name = 'Enter your name.';
  else if (name.length > 120) e.name = 'Keep your name under 120 characters.';
  if (!email) e.email = 'Enter your email so we can reply.';
  else if (!EMAIL_RE.test(email) || email.length > 160) e.email = 'Enter an email like name@example.com.';
  if (phone) {
    const d = phone.replace(/\D/g, '');
    if (d.length < 7 || d.length > 15 || phone.length > 30) e.phone = 'Enter a phone number with 7–15 digits, or leave it blank.';
  }
  if (!(ENQUIRY_TYPES as readonly string[]).includes(f.enquiryType.trim())) e.enquiryType = 'Choose what your enquiry is about.';
  if (message.length < 10) e.message = 'Add a short message (at least 10 characters).';
  else if (message.length > MESSAGE_MAX) e.message = 'Keep your message under 1,500 characters.';
  if (f.consent !== 'yes') e.consent = 'Please agree so we can reply to you.';
  return e;
}
