import {
  IsEnum,
  IsNumber,
  IsString,
  Min,
} from 'class-validator'

import { PaymentMethod } from '@prisma/client'

export class CreatePaymentDto {
  @IsString()
  saleId!: string

  @IsEnum(PaymentMethod)
  method!: PaymentMethod

  @IsNumber()
  @Min(0)
  amount!: number
}