import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ART_KEYS, ArtKey } from '../../common/art';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : typeof value === 'string' ? value.trim() : value);
const numOrNull = ({ value }: { value: unknown }) => (value === '' || value == null ? null : typeof value === 'string' ? Number(value) : value);

export class CreateStyleDto {
  @Transform(trim) @IsString() @IsNotEmpty({ message: 'Add the style name, e.g. “IPA”.' }) @MaxLength(40) name: string;
  @Transform(trim) @IsString() @IsNotEmpty({ message: 'Add the filter label, e.g. “IPAs”.' }) @MaxLength(40) pluralName: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}
export class UpdateStyleDto extends PartialType(CreateStyleDto) {}

export class CreateProductDto {
  @Transform(trim) @IsString() @IsNotEmpty({ message: 'Add the beer’s name.' }) @MaxLength(120) name: string;
  @IsInt({ message: 'Choose a style.' }) styleId: number;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(240, { message: 'Keep the short description under 240 characters.' }) shortDescription?: string;
  @IsOptional() @Transform(emptyToNull) @ValidateIf((_o: unknown, v: unknown) => v !== null) @IsString() @MaxLength(5000) description?: string | null;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(200) imageAlt?: string;
  @IsOptional() @IsIn(ART_KEYS as unknown as string[]) art?: ArtKey;
  @IsOptional() @Transform(numOrNull) @ValidateIf((_o: unknown, v: unknown) => v !== null)
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Enter ABV as a number like 5.4.' }) @Min(0, { message: 'ABV can’t be negative.' }) @Max(20, { message: 'Check the ABV: it should be 20% or less.' })
  abv?: number | null;
  @IsOptional() @Transform(numOrNull) @ValidateIf((_o: unknown, v: unknown) => v !== null)
  @IsInt({ message: 'Enter IBU as a whole number.' }) @Min(0) @Max(150, { message: 'Check the IBU: it should be 150 or less.' })
  ibu?: number | null;
  @IsOptional() @Transform(emptyToNull) @ValidateIf((_o: unknown, v: unknown) => v !== null) @IsString() @MaxLength(1000) ingredients?: string | null;
  @IsOptional() @Transform(emptyToNull) @ValidateIf((_o: unknown, v: unknown) => v !== null) @IsString() @MaxLength(1000) tastingNotes?: string | null;
  @IsOptional() @Transform(emptyToNull) @ValidateIf((_o: unknown, v: unknown) => v !== null) @IsString() @MaxLength(500) serving?: string | null;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() isSample?: boolean;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class AdminProductQuery {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() styleId?: string;
  @IsOptional() @IsIn(['sample', 'real', 'nospecs', 'nophoto', 'featured', 'hidden']) status?: string;
}
