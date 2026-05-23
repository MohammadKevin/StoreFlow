import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'

import { PurchasesService } from './purchases.service'

import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { QueryPurchaseDto } from './dto/query-purchase.dto'

@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryPurchaseDto,
  ) {
    return this.purchasesService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.purchasesService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createPurchaseDto: CreatePurchaseDto,
  ) {
    return this.purchasesService.create(
      createPurchaseDto,
    )
  }
}