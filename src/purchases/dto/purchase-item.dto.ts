import {
  IsNumber,
  IsString,
  Min,
} from 'class-validator'

export class PurchaseItemDto {
  @IsString()
  productId!: string

  @IsNumber()
  @Min(1)
  quantity!: number

  @IsNumber()
  @Min(0)
  costPrice!: number
}