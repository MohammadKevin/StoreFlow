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

import { SuppliersService } from './suppliers.service'

import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'
import { QuerySupplierDto } from './dto/query-supplier.dto'

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QuerySupplierDto,
  ) {
    return this.suppliersService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.suppliersService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createSupplierDto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(
      createSupplierDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(
      id,
      updateSupplierDto,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.suppliersService.remove(id)
  }
}