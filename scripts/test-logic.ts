/**
 * Unit tests for the API's pure logic (no database or framework needed). Run: npm run test:logic
 */
import { strict as assert } from 'assert';
import { slugify } from '../backend/src/common/slug';
import { validateEnquiry } from '../backend/src/inquiries/inquiry-rules';
import { formatAbv, publicProduct } from '../backend/src/products/product-view';
import { CONTENT_SEED, GALLERY_SEED, PRODUCT_SEED, STYLE_SEED } from '../backend/src/seed/seed-data';
import { displayHours, openStatus, todayIn } from '../backend/src/settings/hours';

let passed = 0;
const t = (name: string, fn: () => void) => { try { fn(); passed++; } catch (e) { console.error(`✗ ${name}`); throw e; } };

// --- Products: never show unsupplied specifications
const base = {
  id: 1, slug: 's', name: 'Sample Lager No. 1', styleId: 1, style: { slug: 'lagers', name: 'Lager' }, shortDescription: 'x', description: '  ',
  imageUrl: null, imageAlt: '', art: 'glass-lager', abv: null, ibu: null, ingredients: null, tastingNotes: '', serving: null,
  featured: true, isSample: true, published: true, sortOrder: 0,
} as never;
t('a product without specs exposes none', () => {
  const p = publicProduct(base);
  assert.equal(p.abv, null); assert.equal(p.ibu, null); assert.deepEqual(p.specs, []);
  assert.equal(p.description, null); assert.equal(p.tastingNotes, null);
  assert.equal(p.imageAlt, 'Sample Lager No. 1, lager');
});
t('only supplied specs are listed', () => {
  assert.deepEqual(publicProduct({ ...(base as object), abv: 5.4 } as never).specs, [{ label: 'ABV', value: '5.4%' }]);
  assert.deepEqual(publicProduct({ ...(base as object), abv: 6, ibu: 45 } as never).specs, [{ label: 'ABV', value: '6%' }, { label: 'IBU', value: '45' }]);
  assert.deepEqual(publicProduct({ ...(base as object), ibu: 0 } as never).specs, [{ label: 'IBU', value: '0' }]);
});
t('formatAbv', () => { assert.equal(formatAbv(5.4), '5.4%'); assert.equal(formatAbv(12.04), '12%'); assert.equal(formatAbv(null), null); assert.equal(formatAbv(NaN), null); });
t('slugify', () => { assert.equal(slugify('Seasonal Brews'), 'seasonal-brews'); assert.equal(slugify('Brewer’s Choice IPA'), 'brewer-s-choice-ipa'); });

// --- Enquiries
const good = { name: 'Alex Rivera', email: 'alex@example.com', phone: '', enquiryType: 'Planning a visit', message: 'Hello, can we visit on Saturday?', consent: true };
t('valid enquiry passes', () => { const r = validateEnquiry(good); assert.deepEqual(r.errors, {}); assert.equal(r.clean.phone, null); });
t('enquiry needs consent === true', () => {
  assert.equal(validateEnquiry({ ...good, consent: 'true' }).errors.consent, 'Please agree so we can reply to you.');
  assert.ok(validateEnquiry({ ...good, consent: undefined }).errors.consent);
});
t('enquiry field rules', () => {
  const e = validateEnquiry({ name: 'A', email: 'nope', phone: '12', enquiryType: 'Book a table', message: 'short', consent: true }).errors;
  assert.deepEqual(Object.keys(e).sort(), ['email', 'enquiryType', 'message', 'name', 'phone']);
  assert.ok(validateEnquiry({ ...good, message: 'x'.repeat(1501) }).errors.message);
});

// --- Hours
t('hours stay placeholders until verified', () => {
  const h = displayHours([], false); assert.equal(h.length, 7); assert.ok(h.every((d) => !d.confirmed));
  assert.equal(openStatus([], false, 'America/Los_Angeles'), null);
});
t('open status once verified, including after-midnight close', () => {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({ day, open: '12:00', close: '22:00', closed: day === 'Monday' }));
  // Thursday 2026-11-19 14:00 in Bend (Pacific) = 22:00 UTC
  assert.equal(openStatus(week, true, 'America/Los_Angeles', new Date('2026-11-19T22:00:00Z'))?.isOpen, true);
  // Sunday 2026-11-22 23:00 Pacific → closed; Monday closed → opens Tuesday
  assert.equal(openStatus(week, true, 'America/Los_Angeles', new Date('2026-11-23T07:00:00Z'))?.label, 'Closed now · opens Tuesday at 12:00 PM');
  const late = week.map((d) => ({ ...d, close: '01:00', closed: false }));
  assert.equal(openStatus(late, true, 'America/Los_Angeles', new Date('2026-11-20T08:30:00Z'))?.isOpen, true);
});
t('todayIn uses the brewery timezone', () => { assert.equal(todayIn('America/Los_Angeles', new Date('2026-11-20T05:00:00Z')), '2026-11-19'); });

// --- Seed honesty: nothing invented
t('seed beers are labelled samples with no specs or tasting details', () => {
  assert.equal(PRODUCT_SEED.length, 8);
  for (const p of PRODUCT_SEED as Record<string, unknown>[]) {
    assert.ok(String(p.name).startsWith('Sample '), String(p.name));
    for (const k of ['abv', 'ibu', 'ingredients', 'tastingNotes']) assert.ok(p[k] == null, `${p.name} has ${k}`);
  }
  assert.equal(PRODUCT_SEED.filter((p) => p.featured).length, 5);
  assert.ok(PRODUCT_SEED.every((p) => STYLE_SEED.some((s) => s.slug === p.style)));
});
t('seed story has no invented history, quote or people', () => {
  const chapters = CONTENT_SEED.filter((c) => c.type === 'story_chapter');
  assert.equal(chapters.length, 4); assert.ok(chapters.every((c) => c.body == null && c.fields?.clientNote));
  const q = CONTENT_SEED.find((c) => c.key === 'story_quote');
  assert.equal(q?.fields?.quote, null); assert.equal(q?.fields?.quoteBy, null);
  assert.ok(CONTENT_SEED.filter((c) => c.type === 'visitor_info').every((c) => c.fields?.clientNote === 'To be confirmed'));
  const all = JSON.stringify(CONTENT_SEED).toLowerCase();
  for (const w of ['founded in', 'award', 'est. 1', 'since 19', 'since 20', '★', 'five-star']) assert.ok(!all.includes(w), `seed contains “${w}”`);
});
t('seed gallery images are stand-ins with alt text', () => {
  assert.equal(GALLERY_SEED.length, 14);
  assert.ok(GALLERY_SEED.every((g) => !g.imageUrl && g.alt && g.art));
  assert.equal(GALLERY_SEED.filter((g) => g.featuredOnHome).length, 5);
});

console.log(`✓ ${passed} logic tests passed`);
