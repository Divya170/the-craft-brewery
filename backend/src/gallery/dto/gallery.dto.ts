import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ART_KEYS, ArtKey, RATIOS, Ratio } from '../../common/art';
import { GALLERY_CATEGORIES, GalleryCategory } from '../gallery-item.entity';

export class CreateGalleryItemDto {
  @IsString() @IsNotEmpty({ message: 'Add a short title for the photo.' }) @MaxLength(120) title: string;
  @IsIn(GALLERY_CATEGORIES as unknown as string[], { message: 'Choose a category.' }) category: GalleryCategory;
  @IsOptional() @IsString() @MaxLength(250) alt?: string;
  @IsOptional() @IsIn(RATIOS as unknown as string[], { message: 'Choose a tile shape.' }) ratio?: Ratio;
  @IsOptional() @IsString() @Matches(/^\d{1,3}% \d{1,3}%$/, { message: 'Use a focal point like “50% 50%”.' }) focus?: string;
  @IsOptional() @IsIn(ART_KEYS as unknown as string[]) art?: ArtKey;
  @IsOptional() @IsBoolean() featuredOnHome?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateGalleryItemDto extends PartialType(CreateGalleryItemDto) {}
