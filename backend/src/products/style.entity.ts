import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Product } from './product.entity';

/** A beer style used to group and filter products (Lager, Ale, IPA…). Only styles with published products appear on the site. */
@Entity('styles')
export class Style {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  slug: string;

  /** Singular label on product cards, e.g. "IPA". */
  @Column()
  name: string;

  /** Filter label, e.g. "IPAs". */
  @Column()
  pluralName: string;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @OneToMany('Product', 'style')
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
