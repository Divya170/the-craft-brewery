import { Allow, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { INQUIRY_STATUSES, InquiryStatus } from '../inquiry.entity';

/** Presence only: the rules live in inquiry-rules.ts so messages match the site exactly. */
export class CreateInquiryDto {
  @Allow() name?: string;
  @Allow() email?: string;
  @Allow() phone?: string;
  @Allow() enquiryType?: string;
  @Allow() message?: string;
  /** Must be true: the privacy consent checkbox. */
  @Allow() consent?: boolean;
  /** Honeypot: real visitors never see or fill this. */
  @Allow() website?: string;
}

export class UpdateInquiryDto {
  @IsOptional() @IsIn(INQUIRY_STATUSES as unknown as string[], { message: 'Choose New, Responded or Archived.' }) status?: InquiryStatus;
  @IsOptional() @IsString() @MaxLength(4000) adminNotes?: string | null;
}

export class ListInquiriesQuery {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn([...INQUIRY_STATUSES, 'all']) status?: InquiryStatus | 'all';
  @IsOptional() @IsString() @MaxLength(40) enquiryType?: string;
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsIn(['newest', 'oldest']) sort?: 'newest' | 'oldest';
}
