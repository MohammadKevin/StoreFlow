import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { DiscountType } from '@prisma/client'

export class UpdateDiscountDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsEnum(DiscountType)
  type?: DiscountType

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchase?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}