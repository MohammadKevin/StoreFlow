import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class StockInDto {
  @IsString()
  @IsNotEmpty()
  productId!: string

  @IsString()
  @IsNotEmpty()
  storeId!: string

  @IsNumber()
  @Min(1)
  quantity!: number

  @IsOptional()
  @IsString()
  note?: string
}