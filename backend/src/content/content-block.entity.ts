import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const CONTENT_TYPES = ['page_copy', 'hero_slide', 'story_chapter', 'brand_value', 'process_stage', 'ingredient', 'visitor_info'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/**
 * One polymorphic entity for every simple CMS collection. fields.imageUrl = its uploaded photo (if any);
 * fields.art = the illustration shown until then; fields.clientNote, when set, renders a dashed "to be supplied" note.
 * - page_copy: keyed blocks of page text (key = 'home_hero', 'visit_cta', …). title may contain *accent* words.
 * - hero_slide: homepage hero images that cross-fade (title = caption, fields.alt).
 * - story_chapter: Our Story chapters (founding story, inspiration, background, people). body null until supplied.
 * - brand_value: Our Story values (labelled "proposed" until the client confirms them on about_values).
 * - process_stage: Brewing Process timeline stages (body = summary, fields.more = expandable detail).
 * - ingredient: Brewing Process ingredient tiles.
 * - visitor_info: Visit Us practical items (parking, accessibility…); clientNote marks "to be confirmed".
 */
@Entity('content_blocks')
@Index(['type', 'key'])
export class ContentBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: ContentType;

  @Column({ type: 'varchar', nullable: true })
  key: string | null;

  @Column({ default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'simple-json', default: '{}' })
  fields: Record<string, string | null>;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
