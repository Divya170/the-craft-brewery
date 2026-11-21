import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DayHours } from './days';

export { DAYS, DayHours } from './days';

export interface SocialLink {
  label: string;
  url: string;
}

/** Singleton (id = 1): brewery identity, contact details, hours and every feature flag from the design comp. */
@Entity('settings')
export class Settings {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ default: 'The Craft Brewery' })
  businessName: string;

  @Column({ default: 'Craft brewery · Bend, Oregon' })
  tagline: string;

  @Column({ default: '4827 Aspen Street' })
  addressLine1: string;

  @Column({ default: 'Bend' })
  city: string;

  @Column({ default: 'OR' })
  region: string;

  @Column({ default: '97701' })
  postalCode: string;

  @Column({ default: 'USA' })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  /** The supplied number needs client confirmation; a "Verify" note shows until this is on. */
  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /** Google Maps embed for the Contact page. Seeded with an address-search embed (no invented coordinates). */
  @Column({ type: 'varchar', nullable: true })
  mapEmbedUrl: string | null;

  /** Living imagery: hero cross-fade + slow zoom and the Our Story photo strip. Always pausable, and still for reduced-motion visitors. */
  @Column({ default: true })
  autoMotion: boolean;

  /**
   * Shows the 21+ age confirmation on first visit (remembered on the device for 30 days).
   * The client must confirm Oregon and federal requirements; an age gate is not proof of compliance.
   */
  @Column({ default: true })
  ageGateEnabled: boolean;

  /** Footer links; shown only when set. */
  @Column({ type: 'varchar', nullable: true })
  privacyUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  termsUrl: string | null;

  @Column({ type: 'simple-json', default: '[]' })
  hours: DayHours[];

  /** Hours are shown (and open-now is computed) only once the shop confirms them. Until then the site shows an “Hours to be confirmed” placeholder. */
  @Column({ default: false })
  hoursVerified: boolean;

  /** Official social profiles only. */
  @Column({ type: 'simple-json', default: '[]' })
  socialLinks: SocialLink[];

  @Column({ default: 'A craft brewery in Bend, Oregon. Beer made with character, and a place to see how it’s made.' })
  footerNote: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
