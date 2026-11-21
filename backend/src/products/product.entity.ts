import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { ArtKey } from '../common/art';
import { Style } from './style.entity';

/**
 * A beer in the informational lineup (no prices, cart or ordering).
 * Every specification is nullable and appears on the site only when the brewery has supplied it.
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column()
  name: string;

  @Index()
  @Column({ type: 'integer' })
  styleId: number;

  @ManyToOne(() => Style, (s) => s.products, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'styleId' })
  style: Style;

  /** One or two sentences for cards. */
  @Column({ default: '' })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  imageAlt: string;

  /** Illustration shown until a real product photo is uploaded. */
  @Column({ type: 'varchar', default: 'glass-ale' })
  art: ArtKey;

  /** Alcohol by volume, percent (e.g. 5.4). NULL = not supplied → not shown. */
  @Column({ type: 'real', nullable: true })
  abv: number | null;

  /** International Bitterness Units. NULL = not supplied → not shown. */
  @Column({ type: 'integer', nullable: true })
  ibu: number | null;

  @Column({ type: 'text', nullable: true })
  ingredients: string | null;

  @Column({ type: 'text', nullable: true })
  tastingNotes: string | null;

  /** e.g. glassware or serving temperature, when supplied. */
  @Column({ type: 'text', nullable: true })
  serving: string | null;

  /** Homepage "The lineup". */
  @Column({ default: false })
  featured: boolean;

  /** Design placeholders carry a visible SAMPLE tag until replaced. */
  @Column({ default: false })
  isSample: boolean;

  @Index()
  @Column({ default: true })
  published: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
