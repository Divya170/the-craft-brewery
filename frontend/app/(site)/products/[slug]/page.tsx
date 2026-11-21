import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/site/Icons';
import { Photo } from '@/components/site/Photo';
import { ApiError, getProduct } from '@/lib/api';
import type { ProductDetail } from '@/lib/types';

async function load(slug: string): Promise<ProductDetail | null> {
  try {
    return await getProduct(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const d = await load(params.slug).catch(() => null);
  if (!d) return { title: 'Beer not found' };
  const p = d.product;
  return { title: p.name, description: p.shortDescription || `${p.name}${p.style ? `, a ${p.style.name.toLowerCase()}` : ''} from The Craft Brewery in Bend, Oregon.`, alternates: { canonical: `/products/${p.slug}` } };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const d = await load(params.slug);
  if (!d) notFound();
  const { product: p, related, prev, next, position, total } = d;
  const details = [['Ingredients', p.ingredients], ['Tasting notes', p.tastingNotes], ['Serving', p.serving]].filter(([, v]) => v) as [string, string][];
  const missing = [!p.abv && 'ABV', p.ibu == null && 'IBU', !p.ingredients && 'ingredients', !p.tastingNotes && 'tasting notes'].filter(Boolean);

  return (
    <main id="main">
      <section className="dark grain page-top" aria-labelledby="pd-h" style={{ paddingBottom: 'clamp(64px, 8vw, 112px)' }}>
        <div className="wrap stack" style={{ gap: 'clamp(28px, 4vw, 44px)' }}>
          <nav className="between" aria-label="Product navigation" style={{ alignItems: 'center', paddingBottom: 18, borderBottom: '1px solid var(--line-d)' }}>
            <Link className="tlink" href="/products"><Icon name="back" /><span>All products</span></Link>
            <p className="meta">{position} of {total}{p.style ? ` · ${p.style.name}` : ''}</p>
            <div className="row" style={{ gap: 8 }}>
              {prev ? <Link className="icon-btn" href={`/products/${prev.slug}`} aria-label={`Previous beer: ${prev.name}`}><Icon name="chevL" /></Link> : <span className="icon-btn" aria-hidden="true" style={{ opacity: 0.3 }}><Icon name="chevL" /></span>}
              {next ? <Link className="icon-btn" href={`/products/${next.slug}`} aria-label={`Next beer: ${next.name}`}><Icon name="chevR" /></Link> : <span className="icon-btn" aria-hidden="true" style={{ opacity: 0.3 }}><Icon name="chevR" /></span>}
            </div>
          </nav>
          <div className="split" style={{ alignItems: 'start', gap: 'clamp(28px, 5vw, 80px)' }}>
            <Photo src={p.imageUrl} art={p.art} alt={p.imageAlt} caption="Product photo to be supplied" priority corners className="in" style={{ aspectRatio: '9 / 11', border: '1px solid var(--line-d)' }}>
              {p.isSample && <span className="sample">Sample</span>}
            </Photo>
            <div className="stack" style={{ gap: 24 }}>
              {p.style && <Link className="pc-cat" href={`/products?style=${p.style.slug}`} style={{ color: 'var(--copper-l)', font: '600 .72rem/1 var(--fb)', letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', minHeight: 24 }}>{p.style.name}</Link>}
              <h1 id="pd-h" className="d-xl in d1">{p.name}</h1>
              {p.shortDescription && <p className="lead in d2">{p.shortDescription}</p>}
              {p.specs.length > 0 && <dl className="specs in d2">{p.specs.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>}
              {p.description && <div className="in d3" style={{ font: '400 1.2rem/1.65 var(--fs)', whiteSpace: 'pre-line' }}>{p.description}</div>}
              {details.length > 0 && (
                <dl className="stack in d3">
                  {details.map(([k, v], i) => (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr)', gap: 16, padding: '18px 0', borderTop: '1px solid var(--line-d)', borderBottom: i === details.length - 1 ? '1px solid var(--line-d)' : undefined }}>
                      <dt className="meta">{k}</dt><dd style={{ whiteSpace: 'pre-line' }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {missing.length > 0 && <p className="small"><span className="tbs" style={{ whiteSpace: 'normal' }}>{missing.join(', ')} to be supplied</span></p>}
              <p className="xs muted">Only details verified by the brewery are shown. This is an informational lineup: there’s no online ordering.</p>
              <div className="row btn-row-m"><Link className="btn btn-copper" href="/visit-us">Visit The Brewery <Icon name="arrow" size={16} sw={2.2} className="arr" /></Link><Link className="btn btn-ghost" href="/products">Back to the Lineup</Link></div>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="smoke grain sec-s" aria-labelledby="rel-h">
          <div className="wrap stack" style={{ gap: 32 }}>
            <div className="between"><h2 id="rel-h" className="d-l">More from <em>the lineup</em></h2><Link className="tlink" href="/products"><span>Explore All Products</span><Icon name="arrow" /></Link></div>
            <div className="cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/products/${r.slug}`} className="pcard" style={{ textDecoration: 'none' }}>
                  <Photo src={r.imageUrl} art={r.art} alt={r.imageAlt} caption={false} decorative>{r.isSample && <span className="sample">Sample</span>}</Photo>
                  <span className="pc-cat">{r.style?.name}</span>
                  <span className="pc-name">{r.name}</span>
                  <span className="more">View details <Icon name="arrow" size={16} sw={2.2} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
