import {
  IsNumber,
  IsString,
  Min,
} from 'class-validator'

export class OpenShiftDto {
  @IsString()
  storeId!: string

  @IsString()
  cashierId!: string

  @IsNumber()
  @Min(0)
  startCash!: number
}