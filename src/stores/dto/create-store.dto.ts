import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  qrisImage?: string
}