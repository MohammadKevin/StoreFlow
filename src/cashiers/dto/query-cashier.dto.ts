import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class QueryCashierDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  storeId?: string

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string
}