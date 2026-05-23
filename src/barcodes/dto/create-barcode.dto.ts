import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateBarcodeDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsString()
  @IsNotEmpty()
  storeId!: string

  @IsNumber()
  @Min(0)
  costPrice!: number

  @IsNumber()
  @Min(0)
  sellPrice!: number

  @IsNumber()
  @Min(1)
  quantity!: number
}