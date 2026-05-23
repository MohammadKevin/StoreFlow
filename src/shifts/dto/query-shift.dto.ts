import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class QueryShiftDto {
  @IsOptional()
  @IsString()
  storeId?: string

  @IsOptional()
  @IsString()
  cashierId?: string

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string
}