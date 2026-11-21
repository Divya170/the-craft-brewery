/**
 * Confirms the browser's enquiry validation (frontend/lib/validation.ts) gives exactly the same errors and messages
 * as the API's (backend/src/inquiries/inquiry-rules.ts). Run: npm run test:rules
 * The only intended difference: the form stores consent as 'yes' | '' and sends it to the API as true | false.
 */
import { strict as assert } from 'assert';
import * as B from '../backend/src/inquiries/inquiry-rules';
import * as F from '../frontend/lib/validation';

assert.deepEqual([...F.ENQUIRY_TYPES], [...B.ENQUIRY_TYPES], 'enquiry types differ');
assert.equal(F.MESSAGE_MAX, B.MESSAGE_MAX);
assert.equal(String(F.EMAIL_RE), String(B.EMAIL_RE));

const blank: F.EnquiryFields = { name: '', email: '', phone: '', enquiryType: '', message: '', consent: '', website: '' };
const cases: Partial<F.EnquiryFields>[] = [
  {},
  { name: 'Alex Rivera', email: 'alex@example.com', enquiryType: 'Planning a visit', message: 'Can a group of six visit?', consent: 'yes' },
  { name: 'A', email: 'bad@', phone: '12', enquiryType: 'Other', message: 'Too short', consent: '' },
  { name: 'x'.repeat(121), email: `${'a'.repeat(160)}@example.com`, phone: '+1 (541) 555-0100', enquiryType: 'Group visit', message: 'y'.repeat(1501), consent: 'yes' },
  { name: '  Sam  ', email: '  sam@example.org ', phone: '1234567890123456', enquiryType: ' Our beers ', message: '   ten chars   ', consent: 'yes' },
];
let n = 0;
for (const c of cases) {
  const f = { ...blank, ...c };
  const fe = F.validateEnquiry(f);
  const be = B.validateEnquiry({ ...f, consent: f.consent === 'yes' }).errors;
  assert.deepEqual(fe, be, `mismatch for ${JSON.stringify(c).slice(0, 80)}`);
  n++;
}
console.log(`✓ enquiry rules match front and back (${n} cases)`);
