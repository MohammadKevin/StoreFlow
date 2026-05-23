import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { CashiersService } from './cashiers.service'

import { CreateCashierDto } from './dto/create-cashier.dto'
import { UpdateCashierDto } from './dto/update-cashier.dto'
import { QueryCashierDto } from './dto/query-cashier.dto'

@Controller('cashiers')
export class CashiersController {
  constructor(
    private readonly cashiersService: CashiersService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryCashierDto,
  ) {
    return this.cashiersService.findAll(query)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.cashiersService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createCashierDto: CreateCashierDto,
  ) {
    return this.cashiersService.create(
      createCashierDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateCashierDto: UpdateCashierDto,
  ) {
    return this.cashiersService.update(
      id,
      updateCashierDto,
    )
  }

  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: string,
  ) {
    return this.cashiersService.toggleStatus(id)
  }
}