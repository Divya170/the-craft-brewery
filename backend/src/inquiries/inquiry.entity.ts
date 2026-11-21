import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const INQUIRY_STATUSES = ['new', 'responded', 'archived'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
/** A visit enquiry from the Visit Us page. It never books or confirms a visit: staff reply by email or phone. */
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  /** Reference shown to the visitor on the success card (TCB-yymmdd-XXXX). */
  @Index({ unique: true })
  @Column()
  reference: string;

  @Column()
  name: string;

  @Index()
  @Column()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  /** One of ENQUIRY_TYPES. */
  @Index()
  @Column({ type: 'varchar' })
  enquiryType: string;

  /** When the visitor ticked the privacy consent box (required to send). */
  @Column({ type: 'datetime' })
  consentAt: Date;

  @Column({ type: 'text' })
  message: string;

  @Index()
  @Column({ type: 'varchar', default: 'new' })
  status: InquiryStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  /** SHA-256 of the content, used to refuse an identical resubmission within 10 minutes. */
  @Index()
  @Column({ type: 'varchar', default: '' })
  fingerprint: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
