import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class SaleItemDto {
  @IsString()
  productId!: string

  @IsNumber()
  @Min(1)
  quantity!: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number
}