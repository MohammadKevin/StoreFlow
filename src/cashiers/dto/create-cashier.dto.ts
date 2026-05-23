import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator'

export class CreateCashierDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  pin!: string

  @IsString()
  @IsNotEmpty()
  storeId!: string
}