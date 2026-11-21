/** Illustrated stand-ins shipped with the frontend (/public/art/<key>.svg), shown until a real photo is uploaded. */
export const ART_KEYS = ['tanks', 'pour', 'taproom', 'ingredients', 'barrels', 'exterior', 'flight', 'kettle', 'glass-lager', 'glass-ale', 'glass-ipa', 'glass-stout', 'glass-seasonal'] as const;
export type ArtKey = (typeof ART_KEYS)[number];
export const RATIOS = ['16 / 10', '4 / 5', '3 / 2', '1 / 1', '3 / 4', '16 / 9', '4 / 3'] as const;
export type Ratio = (typeof RATIOS)[number];
