import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import type { ArtKey, Ratio } from '../common/art';

export const GALLERY_CATEGORIES = ['Brewery', 'Brewing Process', 'Products', 'Ingredients', 'Details'] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar' })
  category: GalleryCategory;

  /** Null = not yet photographed; the site shows the labelled illustration instead. */
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  alt: string;

  /** Tile shape in the masonry grid. */
  @Column({ type: 'varchar', default: '3 / 2' })
  ratio: Ratio;

  /** Focal point for cropping, e.g. "50% 50%". */
  @Column({ default: '50% 50%' })
  focus: string;

  /** Illustration shown while no photo is uploaded (always captioned "photo to be supplied"). */
  @Column({ type: 'varchar', default: 'tanks' })
  art: ArtKey;

  /** Shown in the homepage gallery preview (first five by order). */
  @Column({ default: false })
  featuredOnHome: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
