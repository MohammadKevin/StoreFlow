import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class QueryPaymentDto {
  @IsOptional()
  @IsString()
  saleId?: string

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string
}