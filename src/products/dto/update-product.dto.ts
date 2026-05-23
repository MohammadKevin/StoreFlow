import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellPrice?: number

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
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsString()
  categoryId?: string
}