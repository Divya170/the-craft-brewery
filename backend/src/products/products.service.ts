import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../common/slug';
import { removeUpload } from '../common/upload';
import { fieldErrors } from '../common/validation';
import { AdminProductQuery, CreateProductDto, CreateStyleDto, UpdateProductDto, UpdateStyleDto } from './dto/products.dto';
import { Product } from './product.entity';
import { publicProduct } from './product-view';
import { Style } from './style.entity';

export interface StyleSeed { slug: string; name: string; pluralName: string }
export interface ProductSeed { name: string; style: string; art: Product['art']; featured?: boolean; shortDescription: string; description: string }

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Style) private readonly styles: Repository<Style>,
  ) {}

  private publicQb() {
    return this.products.createQueryBuilder('p').innerJoinAndSelect('p.style', 's').where('p.published = 1').andWhere('s.published = 1');
  }

  /** Styles that currently have at least one published product, with counts. Others never appear as filters. */
  async publicStyles() {
    const rows = await this.styles.createQueryBuilder('s')
      .innerJoin('s.products', 'p', 'p.published = 1')
      .select(['s.id AS id', 's.slug AS slug', 's.name AS name', 's.pluralName AS pluralName'])
      .addSelect('COUNT(p.id)', 'count')
      .where('s.published = 1')
      .groupBy('s.id').orderBy('s.sortOrder', 'ASC').addOrderBy('s.id', 'ASC')
      .getRawMany<{ id: number; slug: string; name: string; pluralName: string; count: string }>();
    return rows.map((r) => ({ ...r, id: Number(r.id), count: Number(r.count) }));
  }

  async list() {
    const rows = await this.publicQb().orderBy('s.sortOrder', 'ASC').addOrderBy('p.sortOrder', 'ASC').addOrderBy('p.id', 'ASC').getMany();
    return rows.map(publicProduct);
  }

  async featured(limit = 5) {
    const rows = await this.publicQb().andWhere('p.featured = 1').orderBy('p.sortOrder', 'ASC').addOrderBy('p.id', 'ASC').limit(limit).getMany();
    return rows.map(publicProduct);
  }

  async bySlug(slug: string) {
    const p = await this.publicQb().andWhere('p.slug = :slug', { slug }).getOne();
    if (!p) throw new NotFoundException('We couldn’t find that beer.');
    const same = await this.publicQb().andWhere('p.styleId = :sid AND p.id != :id', { sid: p.styleId, id: p.id }).orderBy('p.sortOrder', 'ASC').limit(3).getMany();
    let related = same;
    if (related.length < 3) {
      const ids = [p.id, ...related.map((r) => r.id)];
      related = related.concat(await this.publicQb().andWhere('p.id NOT IN (:...ids)', { ids }).orderBy('p.featured', 'DESC').addOrderBy('p.sortOrder', 'ASC').limit(3 - related.length).getMany());
    }
    // Previous / next across the whole lineup, for the detail page's navigation.
    const all = await this.publicQb().select(['p.slug', 'p.name', 'p.id']).orderBy('s.sortOrder', 'ASC').addOrderBy('p.sortOrder', 'ASC').addOrderBy('p.id', 'ASC').getMany();
    const i = all.findIndex((x) => x.id === p.id);
    const nav = (x?: Product) => (x ? { slug: x.slug, name: x.name } : null);
    return { product: publicProduct(p), related: related.map(publicProduct), prev: nav(all[i - 1]), next: nav(all[i + 1]), position: i + 1, total: all.length };
  }

  /* ---------- admin: styles ---------- */

  listStyles(search?: string) {
    const qb = this.styles.createQueryBuilder('s').loadRelationCountAndMap('s.productCount', 's.products').orderBy('s.sortOrder', 'ASC').addOrderBy('s.id', 'ASC');
    if (search?.trim()) qb.where('LOWER(s.name) LIKE :q OR LOWER(s.pluralName) LIKE :q', { q: `%${search.trim().toLowerCase()}%` });
    return qb.getMany();
  }

  async findStyle(id: number) {
    const s = await this.styles.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Style not found.');
    return s;
  }

  private async uniqueSlug(repo: Repository<Product> | Repository<Style>, text: string) {
    const base = slugify(text) || 'item';
    let slug = base;
    for (let i = 2; await (repo as Repository<Product>).findOne({ where: { slug } }); i++) slug = `${base}-${i}`;
    return slug;
  }

  async createStyle(dto: CreateStyleDto) {
    if (await this.styles.createQueryBuilder('s').where('LOWER(s.name) = :n', { n: dto.name.toLowerCase() }).getCount()) throw fieldErrors({ name: 'This style already exists.' });
    return this.styles.save(this.styles.create({ ...dto, sortOrder: dto.sortOrder ?? (await this.styles.count()), slug: await this.uniqueSlug(this.styles, dto.pluralName) }));
  }

  async updateStyle(id: number, dto: UpdateStyleDto) {
    const s = await this.findStyle(id);
    if (dto.name && dto.name.toLowerCase() !== s.name.toLowerCase()
      && await this.styles.createQueryBuilder('s').where('LOWER(s.name) = :n AND s.id != :id', { n: dto.name.toLowerCase(), id }).getCount()) {
      throw fieldErrors({ name: 'This style already exists.' });
    }
    Object.assign(s, dto);
    return this.styles.save(s);
  }

  async removeStyle(id: number) {
    const s = await this.findStyle(id);
    const n = await this.products.count({ where: { styleId: id } });
    if (n) throw new ConflictException({ statusCode: 409, message: `This style still has ${n} ${n === 1 ? 'beer' : 'beers'}. Move or delete them first, or hide the style instead.` });
    await this.styles.remove(s);
    return { ok: true };
  }

  /* ---------- admin: products ---------- */

  listProducts(q: AdminProductQuery) {
    const qb = this.products.createQueryBuilder('p').leftJoinAndSelect('p.style', 's').orderBy('s.sortOrder', 'ASC').addOrderBy('p.sortOrder', 'ASC').addOrderBy('p.id', 'ASC');
    if (q.search?.trim()) qb.andWhere('LOWER(p.name) LIKE :q', { q: `%${q.search.trim().toLowerCase()}%` });
    if (q.styleId && /^\d+$/.test(q.styleId)) qb.andWhere('p.styleId = :sid', { sid: Number(q.styleId) });
    const where: Record<string, string> = {
      sample: 'p.isSample = 1', real: 'p.isSample = 0', nospecs: 'p.abv IS NULL AND p.ibu IS NULL', nophoto: 'p.imageUrl IS NULL',
      featured: 'p.featured = 1', hidden: 'p.published = 0',
    };
    if (q.status && where[q.status]) qb.andWhere(where[q.status]);
    return qb.getMany();
  }

  async counts() {
    const [total, samples, published, noSpecs, noPhoto] = await Promise.all([
      this.products.count(), this.products.count({ where: { isSample: true } }), this.products.count({ where: { published: true } }),
      this.products.createQueryBuilder('p').where('p.abv IS NULL AND p.ibu IS NULL').getCount(),
      this.products.createQueryBuilder('p').where('p.imageUrl IS NULL').getCount(),
    ]);
    return { total, samples, published, noSpecs, noPhoto };
  }

  async findProduct(id: number) {
    const p = await this.products.findOne({ where: { id }, relations: { style: true } });
    if (!p) throw new NotFoundException('Beer not found.');
    return p;
  }

  async createProduct(dto: CreateProductDto) {
    await this.findStyle(dto.styleId).catch(() => { throw fieldErrors({ styleId: 'Choose a style.' }); });
    const sortOrder = dto.sortOrder ?? (await this.products.count({ where: { styleId: dto.styleId } }));
    const saved = await this.products.save(this.products.create({ ...dto, sortOrder, slug: await this.uniqueSlug(this.products, dto.name) }));
    return this.findProduct(saved.id);
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const p = await this.findProduct(id);
    if (dto.styleId !== undefined && dto.styleId !== p.styleId) await this.findStyle(dto.styleId).catch(() => { throw fieldErrors({ styleId: 'Choose a style.' }); });
    const { style: _s, ...rest } = p;
    await this.products.save({ ...rest, ...dto });
    return this.findProduct(id);
  }

  async removeProduct(id: number) {
    const p = await this.findProduct(id);
    removeUpload(p.imageUrl);
    await this.products.remove(p);
    return { ok: true };
  }

  async setImage(id: number, url: string | null) {
    const p = await this.findProduct(id);
    if (p.imageUrl && p.imageUrl !== url) removeUpload(p.imageUrl);
    const { style: _s, ...rest } = p;
    await this.products.save({ ...rest, imageUrl: url });
    return this.findProduct(id);
  }

  /* ---------- seed ---------- */

  async seed(styles: StyleSeed[], products: ProductSeed[]) {
    if ((await this.styles.count()) > 0) return;
    const saved = await this.styles.save(styles.map((s, i) => this.styles.create({ ...s, sortOrder: i, published: true })));
    const bySlug = new Map(saved.map((s) => [s.slug, s.id]));
    await this.products.save(products.map((p, i) => this.products.create({
      slug: slugify(p.name), name: p.name, styleId: bySlug.get(p.style)!, art: p.art, featured: !!p.featured,
      shortDescription: p.shortDescription, description: p.description, imageAlt: '',
      abv: null, ibu: null, ingredients: null, tastingNotes: null, serving: null, isSample: true, published: true, sortOrder: i,
    })));
  }
}
