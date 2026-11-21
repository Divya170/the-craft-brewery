import type { Product } from './product.entity';

/** Pure helpers shared by the service and the unit tests. */
export function formatAbv(abv: number | null | undefined) {
  if (abv == null || !Number.isFinite(abv)) return null;
  return `${Number(abv.toFixed(1))}%`;
}

/** Text fields count as supplied only when they contain something other than whitespace. */
const text = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

/**
 * The public shape of a product. Unsupplied specifications are null and `specs` lists only what exists,
 * so the site never renders an invented ABV, IBU, ingredient or tasting note.
 */
export function publicProduct(p: Product) {
  const abv = formatAbv(p.abv);
  const specs: { label: string; value: string }[] = [];
  if (abv) specs.push({ label: 'ABV', value: abv });
  if (p.ibu != null) specs.push({ label: 'IBU', value: String(p.ibu) });
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    style: p.style ? { slug: p.style.slug, name: p.style.name } : null,
    shortDescription: p.shortDescription,
    description: text(p.description),
    imageUrl: p.imageUrl,
    imageAlt: p.imageAlt || `${p.name}${p.style ? `, ${p.style.name.toLowerCase()}` : ''}`,
    art: p.art,
    abv,
    ibu: p.ibu,
    specs,
    ingredients: text(p.ingredients),
    tastingNotes: text(p.tastingNotes),
    serving: text(p.serving),
    featured: p.featured,
    isSample: p.isSample,
  };
}
export type PublicProduct = ReturnType<typeof publicProduct>;
