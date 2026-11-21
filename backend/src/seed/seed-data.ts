import type { ContentBlock } from '../content/content-block.entity';
import type { GalleryItem } from '../gallery/gallery-item.entity';
import type { ProductSeed, StyleSeed } from '../products/products.service';

/**
 * First-run content, taken from The Craft Brewery design (design-source/).
 * Rules from the brief: no invented beer names or specs, hours, history, founders, awards, reviews or facilities.
 * Missing facts are left empty or carry fields.clientNote ("to be supplied" on the site).
 */
type F = Record<string, string | null>;
const pc = (key: string, title: string, body: string | null, fields: F = {}): Partial<ContentBlock> => ({ type: 'page_copy', key, title, body, fields });
const item = (type: ContentBlock['type'], title: string, body: string | null, fields: F, sortOrder: number): Partial<ContentBlock> => ({ type, title, body, fields, sortOrder });

export const CONTENT_SEED: Partial<ContentBlock>[] = [
  // Home
  pc('home_hero', 'Crafted with character.', 'Discover the craft, character, and brewing spirit behind The Craft Brewery.', { eyebrow: 'Craft brewery · Bend, Oregon', cta: 'Explore Our Beers', cta2: 'Discover Our Brewery' }),
  pc('home_intro', 'Good beer begins with a *passion* for the craft.', 'The Craft Brewery is a craft brewery at 4827 Aspen Street in Bend, Oregon: a place where beer is made with care, and where you can come and see it for yourself.', {
    eyebrow: 'Who we are', cta: 'Read Our Story', alt: 'Copper brew kettle with steam rising', art: 'kettle', imageUrl: null,
    clientNote: 'Add a short introduction in the brewery’s own words. No founding date, founders or history appear until The Craft Brewery provides them.',
  }),
  pc('home_products', 'The *lineup*', null, { eyebrow: 'Featured beers', cta: 'Explore All Products' }),
  pc('home_experience', 'More than what’s in the *glass.*', 'A brewery is a place you can feel: the warmth of the brewhouse, the shine of steel and copper, the first pour of the day. Come and see where the craft happens.', {
    eyebrow: 'The brewery experience', cta: 'Plan Your Visit', alt: 'Warmly lit brewery bar with a wall of taps', art: 'taproom', imageUrl: null,
    clientNote: 'Facilities, food and events to be confirmed.',
  }),
  pc('home_philosophy', 'Rooted in the craft. *Made with purpose.*', 'Three ideas at the heart of good brewing, shared here as themes rather than claims about specific methods.', { eyebrow: 'Brewing philosophy', cta: 'Discover Our Process' }),
  pc('home_gallery', 'Inside the *brewery*', null, { eyebrow: 'Gallery', cta: 'Explore the Gallery' }),
  pc('home_visit', 'Your next brewery visit *starts here.*', null, { eyebrow: 'Plan your visit', art: 'exterior', imageUrl: null }),
  // Products
  pc('products_hero', 'Explore the craft.', 'Discover the beers and brewing character of The Craft Brewery.', { eyebrow: 'Our products', alt: 'A flight of beers on a wooden paddle', art: 'flight', imageUrl: null }),
  pc('products_cta', 'Discover the brewery *behind the beer.*', null, { cta: 'Visit The Brewery', art: 'barrels', imageUrl: null }),
  // Our Story
  pc('story_hero', 'Every brew has a story.', 'Get to know the craft, inspiration, and character behind The Craft Brewery.', { eyebrow: 'Our story', alt: 'Oak barrels stacked against a brick wall', art: 'barrels', imageUrl: null }),
  pc('story_intro', 'Made in Bend, *Oregon.*', null, { eyebrow: 'The brewery', clientNote: 'Each chapter below is an editable space for The Craft Brewery’s own words. No founders, dates or history are shown until they’re provided.' }),
  pc('story_quote', 'A line from the people behind the brewery', null, { quote: null, quoteBy: null }),
  pc('story_values', 'Brand *values*', null, { eyebrow: 'What we stand for', clientNote: 'Proposed values, awaiting client confirmation.' }),
  pc('story_atmosphere', 'Steel, copper & *warm light*', null, { eyebrow: 'Atmosphere' }),
  pc('story_cta', 'Come experience *the craft.*', '4827 Aspen Street, Bend, Oregon.', { cta: 'Find Us', cta2: 'See the Brewing Process', art: 'exterior', imageUrl: null }),
  // Brewing process
  pc('process_hero', 'The art behind every brew.', null, { eyebrow: 'Brewing process', alt: 'Copper brew kettle with steam rising', art: 'kettle', imageUrl: null }),
  pc('process_intro', 'Four ingredients. *Endless character.*', 'At its heart, beer is grain, water, hops and yeast, transformed by heat, time and care.', {
    eyebrow: 'Craft brewing, simply',
    body2: 'Craft brewers make beer in smaller batches and pay close attention at every step. The journey below follows the general path any brewery takes, from choosing ingredients to filling the keg.',
    clientNote: 'This describes brewing in general, not The Craft Brewery’s specific equipment, recipes or methods. Those details can be added once confirmed.',
  }),
  pc('process_journey', 'Seven *stages*', null, { eyebrow: 'The brewing journey' }),
  pc('process_ingredients', 'The *building blocks*', 'Their general roles in brewing. Specific varieties or suppliers are shown only once The Craft Brewery confirms them.', { eyebrow: 'Ingredients' }),
  pc('process_cta', 'See the craft *come to life.*', null, { cta: 'Visit Us', cta2: 'Explore Our Beers', art: 'tanks', imageUrl: null }),
  // Visit
  pc('visit_hero', 'Come on in.', 'Discover The Craft Brewery in Bend, Oregon.', { eyebrow: 'Visit us', alt: 'The brewery building at dusk with string lights', art: 'exterior', imageUrl: null }),
  pc('visit_info', 'Visitor *information*', 'Practical details will appear here as The Craft Brewery confirms them. Nothing below is assumed.', { eyebrow: 'Before you come' }),
  pc('visit_enquiry', 'Planning a *visit?*', 'Ask about visiting, a group, or anything else. This sends a message to the brewery; it doesn’t book or confirm a visit. We’ll reply by email.', { eyebrow: 'Visit enquiry' }),
  pc('visit_cta', 'We look forward to *welcoming you.*', null, { art: 'taproom', imageUrl: null }),
  // Gallery
  pc('gallery_hero', 'Inside the craft.', 'Steel, copper, grain and glass: a look around the brewery.', { eyebrow: 'Gallery' }),

  item('hero_slide', 'The brewhouse', null, { alt: 'Stainless steel fermentation tanks under warm pendant lights in a brick brewhouse', art: 'tanks', imageUrl: null }, 0),
  item('hero_slide', 'The pour', null, { alt: 'Amber beer pouring from a copper tap into a glass', art: 'pour', imageUrl: null }, 1),
  item('hero_slide', 'The brewery', null, { alt: 'Bar with a wall of taps under pendant lights', art: 'taproom', imageUrl: null }, 2),

  item('story_chapter', 'How it began', null, { numeral: 'I', art: 'kettle', imageUrl: null, clientNote: 'The founding story: how and why The Craft Brewery started.' }, 0),
  item('story_chapter', 'What inspires us', null, { numeral: 'II', art: 'ingredients', imageUrl: null, clientNote: 'The brand’s inspiration: the beers, places or people that shaped it.' }, 1),
  item('story_chapter', 'The brewery today', null, { numeral: 'III', art: null, imageUrl: null, clientNote: 'Brewery background: the space, the equipment, how the beer is made here.' }, 2),
  item('story_chapter', 'The people', null, { numeral: 'IV', art: null, imageUrl: null, clientNote: 'The people behind the brewery: names, roles and portraits, only with their permission.' }, 3),

  item('brand_value', 'Craftsmanship', 'Doing the work by hand and by eye, and taking pride in it.', { art: 'kettle', imageUrl: null }, 0),
  item('brand_value', 'Quality', 'Only pouring beer we’d be proud to share.', { art: 'flight', imageUrl: null }, 1),
  item('brand_value', 'Creativity', 'Respecting tradition while leaving room to experiment.', { art: 'ingredients', imageUrl: null }, 2),
  item('brand_value', 'Community', 'A brewery is better with good people around it.', { art: 'taproom', imageUrl: null }, 3),

  item('process_stage', 'Ingredient selection', 'Every beer begins with choosing malt, hops, yeast and water to suit the style being brewed.', { more: 'The balance of grains shapes colour and body, the hops shape bitterness and aroma, and the yeast strain adds its own character.', art: 'ingredients', focus: '50% 50%', imageUrl: null }, 0),
  item('process_stage', 'Mashing', 'Crushed malt is steeped in hot water, where natural enzymes turn starches into fermentable sugars. The sweet liquid is called wort.', { more: 'Brewers often hold the mash in the range of about 145–158°F; small changes in temperature affect how full-bodied or dry the finished beer is.', art: 'kettle', focus: '50% 55%', imageUrl: null }, 1),
  item('process_stage', 'Lautering', 'The sweet wort is separated from the spent grain, and the grain bed is rinsed with hot water to collect the remaining sugars.', { more: 'That rinse is called sparging. The spent grain left behind is often reused, for example as animal feed or compost.', art: 'tanks', focus: '30% 50%', imageUrl: null }, 2),
  item('process_stage', 'Boiling', 'The wort is brought to a rolling boil, and hops are added along the way.', { more: 'Hops added early contribute bitterness; hops added near the end keep more of their aroma. Boiling also sterilises the wort before fermentation.', art: 'kettle', focus: '50% 20%', imageUrl: null }, 3),
  item('process_stage', 'Fermentation', 'Cooled wort meets yeast, which turns sugars into alcohol and carbon dioxide over days or weeks.', { more: 'Ales usually ferment warmer and faster; lagers ferment cooler and take longer, which tends to give a cleaner, crisper taste.', art: 'tanks', focus: '70% 50%', imageUrl: null }, 4),
  item('process_stage', 'Conditioning', 'The young beer rests and matures. Flavours round out, the beer clears, and carbonation is adjusted.', { more: 'Some beers condition for a short time in tanks; others age for longer, sometimes in barrels, to develop deeper character.', art: 'barrels', focus: '50% 50%', imageUrl: null }, 5),
  item('process_stage', 'Packaging', 'Finished beer is moved into kegs, cans or bottles and kept cold to stay fresh.', { more: 'How and where a brewery packages and serves its beer varies. The Craft Brewery’s own formats will be added once confirmed.', art: 'pour', focus: '55% 50%', imageUrl: null }, 6),

  item('ingredient', 'Water', 'Most of what’s in the glass. Its minerals influence how a beer tastes and feels.', { art: 'pour', focus: '50% 60%', imageUrl: null }, 0),
  item('ingredient', 'Malt', 'Malted grain, usually barley, supplies the sugars, colour and much of the body.', { art: 'ingredients', focus: '30% 70%', imageUrl: null }, 1),
  item('ingredient', 'Hops', 'Flowers that bring bitterness to balance the malt, plus aroma and flavour.', { art: 'ingredients', focus: '20% 20%', imageUrl: null }, 2),
  item('ingredient', 'Yeast', 'The living ingredient that ferments sugar into alcohol and adds its own character.', { art: 'flight', focus: '50% 70%', imageUrl: null }, 3),

  item('visitor_info', 'Parking', 'Where to park when you arrive.', { clientNote: 'To be confirmed' }, 0),
  item('visitor_info', 'Accessibility', 'Step-free access, restrooms and seating details.', { clientNote: 'To be confirmed' }, 1),
  item('visitor_info', 'Groups', 'Whether larger groups can visit, and how to arrange it.', { clientNote: 'To be confirmed' }, 2),
  item('visitor_info', 'Age requirements', 'Who can visit, including any rules for under-21s or children.', { clientNote: 'To be confirmed' }, 3),
  item('visitor_info', 'Visitor facilities', 'What’s on site for visitors.', { clientNote: 'To be confirmed' }, 4),
];

export const STYLE_SEED: StyleSeed[] = [
  { slug: 'lagers', name: 'Lager', pluralName: 'Lagers' },
  { slug: 'ales', name: 'Ale', pluralName: 'Ales' },
  { slug: 'ipas', name: 'IPA', pluralName: 'IPAs' },
  { slug: 'stouts', name: 'Stout', pluralName: 'Stouts' },
  { slug: 'seasonal-brews', name: 'Seasonal Brew', pluralName: 'Seasonal Brews' },
];

/** Clearly identified SAMPLE beers: no real names, ABV, IBU, ingredients or tasting notes. */
const sample = (style: string, label: string, n: number, art: ProductSeed['art'], featured = false): ProductSeed => ({
  name: `Sample ${label} No. ${n}`, style, art, featured,
  shortDescription: `A placeholder for a real ${label.toLowerCase()}. Name and description to be supplied.`,
  description: 'This is a sample entry standing in for one of The Craft Brewery’s beers. Its real name, style description, ingredients and tasting notes will be added once the brewery supplies and verifies them.',
});
export const PRODUCT_SEED: ProductSeed[] = [
  sample('lagers', 'Lager', 1, 'glass-lager', true),
  sample('ipas', 'IPA', 1, 'glass-ipa', true),
  sample('ales', 'Ale', 1, 'glass-ale', true),
  sample('stouts', 'Stout', 1, 'glass-stout', true),
  sample('seasonal-brews', 'Seasonal', 1, 'glass-seasonal', true),
  sample('lagers', 'Lager', 2, 'glass-lager'),
  sample('ipas', 'IPA', 2, 'glass-ipa'),
  sample('ales', 'Ale', 2, 'glass-ale'),
];

const g = (title: string, category: GalleryItem['category'], alt: string, art: GalleryItem['art'], ratio: GalleryItem['ratio'], focus = '50% 50%', featuredOnHome = false): Partial<GalleryItem> => ({ title, category, alt, art, ratio, focus, featuredOnHome, imageUrl: null, published: true });
export const GALLERY_SEED: Partial<GalleryItem>[] = [
  g('The brewhouse', 'Brewery', 'Row of stainless steel fermentation tanks under pendant lights', 'tanks', '16 / 10', '50% 50%', true),
  g('A flight to compare', 'Products', 'Four beers from pale gold to near black on a wooden paddle', 'flight', '4 / 5', '50% 60%'),
  g('The kettle', 'Brewing Process', 'Copper brew kettle with steam rising', 'kettle', '4 / 5', '50% 40%'),
  g('Hops and malt', 'Ingredients', 'Hop cones and malted grain on wood', 'ingredients', '1 / 1', '50% 50%', true),
  g('At the bar', 'Brewery', 'Bar with a wall of taps and stools', 'taproom', '3 / 2', '50% 50%', true),
  g('The pour', 'Products', 'Amber beer pouring from a copper tap', 'pour', '16 / 10', '50% 50%', true),
  g('Barrels', 'Details', 'Oak barrels stacked against brick', 'barrels', '3 / 2', '50% 50%', true),
  g('A hazy pint', 'Products', 'Glass of golden beer with a thick head', 'glass-ipa', '4 / 5'),
  g('Fermentation', 'Brewing Process', 'Close view of a conical fermenter', 'tanks', '3 / 4', '30% 40%'),
  g('From the street', 'Brewery', 'Brick brewery building at dusk with string lights', 'exterior', '3 / 2'),
  g('Malted grain', 'Ingredients', 'Pale malted grain scattered on wood', 'ingredients', '4 / 3', '25% 70%'),
  g('Dark and rich', 'Products', 'Glass of near-black beer with a cream head', 'glass-stout', '4 / 5'),
  g('The taps', 'Details', 'Row of tap handles in different colours', 'taproom', '16 / 9', '50% 18%'),
  g('Pale and bright', 'Products', 'Glass of pale golden beer', 'glass-lager', '1 / 1', '50% 60%'),
].map((x, i) => ({ ...x, sortOrder: i }));
