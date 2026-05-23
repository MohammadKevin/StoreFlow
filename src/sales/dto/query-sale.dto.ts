import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class QuerySaleDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  storeId?: string

  @IsOptional()
  @IsString()
  cashierId?: string

  @IsOptional()
  @IsString()
  customerId?: string

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string
}