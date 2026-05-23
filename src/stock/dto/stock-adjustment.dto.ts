import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class StockAdjustmentDto {
  @IsString()
  @IsNotEmpty()
  productId!: string

  @IsString()
  @IsNotEmpty()
  storeId!: string

  @IsNumber()
  @Min(0)
  newStock!: number

  @IsOptional()
  @IsString()
  note?: string
}