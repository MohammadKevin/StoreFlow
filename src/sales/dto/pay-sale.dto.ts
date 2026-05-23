import {
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator'

import { PaymentMethod } from '@prisma/client'

export class PaySaleDto {
  @IsNumber()
  @Min(0)
  paidAmount!: number

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod
}