import { IsNotEmpty, IsString, Length } from 'class-validator'

export class VerifyPinDto {
  @IsString()
  @IsNotEmpty()
  cashierId!: string

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  pin!: string
}