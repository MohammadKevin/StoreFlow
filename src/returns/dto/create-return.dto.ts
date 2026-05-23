import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { Type } from 'class-transformer'

import { ReturnItemDto } from './return-item.dto'

export class CreateReturnDto {
  @IsString()
  saleId!: string

  @IsOptional()
  @IsString()
  reason?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items!: ReturnItemDto[]
}