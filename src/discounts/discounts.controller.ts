import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { DiscountsService } from './discounts.service'

import { CreateDiscountDto } from './dto/create-discount.dto'
import { UpdateDiscountDto } from './dto/update-discount.dto'
import { QueryDiscountDto } from './dto/query-discount.dto'

@Controller('discounts')
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryDiscountDto,
  ) {
    return this.discountsService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.discountsService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createDiscountDto: CreateDiscountDto,
  ) {
    return this.discountsService.create(
      createDiscountDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(
      id,
      updateDiscountDto,
    )
  }

  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: string,
  ) {
    return this.discountsService.toggleStatus(
      id,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.discountsService.remove(id)
  }
}