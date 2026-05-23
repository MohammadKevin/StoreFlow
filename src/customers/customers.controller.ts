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

import { CustomersService } from './customers.service'

import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { QueryCustomerDto } from './dto/query-customer.dto'

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryCustomerDto,
  ) {
    return this.customersService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.customersService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(
      createCustomerDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(
      id,
      updateCustomerDto,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id)
  }
}
