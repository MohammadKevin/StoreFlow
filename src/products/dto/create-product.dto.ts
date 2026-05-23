import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsNumber()
  @Min(0)
  costPrice!: number

  @IsNumber()
  @Min(0)
  sellPrice!: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number

  @IsOptional()
  @IsBoolean()
  trackStock?: boolean

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsString()
  @IsNotEmpty()
  storeId!: string

  @IsOptional()
  @IsString()
  categoryId?: string
}