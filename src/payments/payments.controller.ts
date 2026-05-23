import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'

import { PaymentsService } from './payments.service'

import { CreatePaymentDto } from './dto/create-payment.dto'
import { QueryPaymentDto } from './dto/query-payment.dto'

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryPaymentDto,
  ) {
    return this.paymentsService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.paymentsService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(
      createPaymentDto,
    )
  }
}