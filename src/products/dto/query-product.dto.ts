import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class QueryProductDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  storeId?: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  barcode?: string

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string
}