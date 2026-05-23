import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { Type } from 'class-transformer'

import { PurchaseItemDto } from './purchase-item.dto'

export class CreatePurchaseDto {
  @IsString()
  storeId!: string

  @IsString()
  supplierId!: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[]
}