/**
 * Pure validation for the Visit Us enquiry form (no Nest/TypeORM imports, so it can be unit-tested directly).
 * frontend/lib/validation.ts mirrors these rules and messages exactly; `npm run test:rules` checks they agree.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ENQUIRY_TYPES = ['Planning a visit', 'Group visit', 'Our beers', 'General question', 'Other'] as const;
export const MESSAGE_MAX = 1500;

export const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export interface EnquiryInput { name?: unknown; email?: unknown; phone?: unknown; enquiryType?: unknown; message?: unknown; consent?: unknown }

export function validateEnquiry(dto: EnquiryInput) {
  const e: Record<string, string> = {};
  const name = str(dto.name).trim();
  const email = str(dto.email).trim();
  const phone = str(dto.phone).trim();
  const enquiryType = str(dto.enquiryType).trim();
  const message = str(dto.message).trim();
  if (name.length < 2) e.name = 'Enter your name.';
  else if (name.length > 120) e.name = 'Keep your name under 120 characters.';
  if (!email) e.email = 'Enter your email so we can reply.';
  else if (!EMAIL_RE.test(email) || email.length > 160) e.email = 'Enter an email like name@example.com.';
  if (phone) {
    const d = phone.replace(/\D/g, '');
    if (d.length < 7 || d.length > 15 || phone.length > 30) e.phone = 'Enter a phone number with 7–15 digits, or leave it blank.';
  }
  if (!(ENQUIRY_TYPES as readonly string[]).includes(enquiryType)) e.enquiryType = 'Choose what your enquiry is about.';
  if (message.length < 10) e.message = 'Add a short message (at least 10 characters).';
  else if (message.length > MESSAGE_MAX) e.message = 'Keep your message under 1,500 characters.';
  if (dto.consent !== true) e.consent = 'Please agree so we can reply to you.';
  return { errors: e, clean: { name, email, phone: phone || null, enquiryType, message } };
}
