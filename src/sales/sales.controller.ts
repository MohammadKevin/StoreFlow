import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { SalesService } from './sales.service'

import { CreateSaleDto } from './dto/create-sale.dto'
import { PaySaleDto } from './dto/pay-sale.dto'
import { QuerySaleDto } from './dto/query-sale.dto'

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QuerySaleDto,
  ) {
    return this.salesService.findAll(query)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.salesService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createSaleDto: CreateSaleDto,
  ) {
    return this.salesService.create(
      createSaleDto,
    )
  }

  @Patch(':id/pay')
  async pay(
    @Param('id') id: string,

    @Body()
    paySaleDto: PaySaleDto,
  ) {
    return this.salesService.pay(
      id,
      paySaleDto,
    )
  }
}