export const ART_OPTIONS = [
  { value: 'tanks', label: 'Brewhouse tanks' }, { value: 'pour', label: 'The pour' }, { value: 'taproom', label: 'Bar & taps' },
  { value: 'ingredients', label: 'Hops & malt' }, { value: 'barrels', label: 'Barrels' }, { value: 'exterior', label: 'Building exterior' },
  { value: 'flight', label: 'Beer flight' }, { value: 'kettle', label: 'Copper kettle' },
  { value: 'glass-lager', label: 'Glass: pale' }, { value: 'glass-ale', label: 'Glass: amber' }, { value: 'glass-ipa', label: 'Glass: golden' },
  { value: 'glass-stout', label: 'Glass: dark' }, { value: 'glass-seasonal', label: 'Glass: copper' },
];
export const RATIO_OPTIONS = ['16 / 10', '4 / 5', '3 / 2', '1 / 1', '3 / 4', '16 / 9', '4 / 3'].map((r) => ({ value: r, label: r.replace(/ /g, '') }));
export const GALLERY_CATEGORY_OPTIONS = ['Brewery', 'Brewing Process', 'Products', 'Ingredients', 'Details'].map((v) => ({ value: v, label: v }));
export const ENQUIRY_TYPE_OPTIONS = ['Planning a visit', 'Group visit', 'Our beers', 'General question', 'Other'].map((v) => ({ value: v, label: v }));
