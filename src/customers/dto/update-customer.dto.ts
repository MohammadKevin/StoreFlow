import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  storeId?: string

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