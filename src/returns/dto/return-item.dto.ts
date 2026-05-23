import {
  IsNumber,
  IsString,
  Min,
} from 'class-validator'

export class ReturnItemDto {
  @IsString()
  productId!: string

  @IsNumber()
  @Min(1)
  quantity!: number
}