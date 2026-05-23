import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { StoresService } from './stores.service'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { QueryStoreDto } from './dto/query-store.dto'

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryStoreDto,
  ) {
    return this.storesService.findAll(query)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.storesService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createStoreDto: CreateStoreDto,
  ) {
    return this.storesService.create(
      createStoreDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateStoreDto: UpdateStoreDto,
  ) {
    return this.storesService.update(
      id,
      updateStoreDto,
    )
  }

  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: string,
  ) {
    return this.storesService.toggleStatus(id)
  }
}