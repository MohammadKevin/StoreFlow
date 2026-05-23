import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { DiscountType } from '@prisma/client'

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  code?: string

  @IsEnum(DiscountType)
  type!: DiscountType

  @IsNumber()
  @Min(0)
  value!: number

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

  @IsString()
  @IsNotEmpty()
  storeId!: string
}