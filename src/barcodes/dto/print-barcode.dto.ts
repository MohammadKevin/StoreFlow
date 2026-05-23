import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

import { Type } from 'class-transformer'

class PrintBarcodeItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string

  @IsInt()
  @Min(1)
  qty!: number
}

export class PrintBarcodeDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrintBarcodeItemDto)
  items!: PrintBarcodeItemDto[]
}