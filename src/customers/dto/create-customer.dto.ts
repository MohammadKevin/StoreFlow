import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateCustomerDto {
  @IsString()
  name!: string

  @IsString()
  storeId!: string

  @IsOptional()
  @IsPhoneNumber('ID')
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  address?: string
}