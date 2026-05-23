import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class QueryStockDto {
  @IsOptional()
  @IsString()
  storeId?: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string
}