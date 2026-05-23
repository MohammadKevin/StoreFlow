import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class StockOutDto {
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
  reason?: string
}