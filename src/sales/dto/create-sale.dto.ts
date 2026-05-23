import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { Type } from 'class-transformer'

import { SaleItemDto } from './sale-item.dto'

export class CreateSaleDto {
  @IsString()
  storeId!: string

  @IsString()
  cashierId!: string

  @IsOptional()
  @IsString()
  customerId?: string

  @IsOptional()
  @IsString()
  discountId?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items!: SaleItemDto[]
}