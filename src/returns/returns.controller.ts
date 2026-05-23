import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'

import { ReturnsService } from './returns.service'

import { CreateReturnDto } from './dto/create-return.dto'
import { QueryReturnDto } from './dto/query-return.dto'

@Controller('returns')
export class ReturnsController {
  constructor(
    private readonly returnsService: ReturnsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryReturnDto,
  ) {
    return this.returnsService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.returnsService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createReturnDto: CreateReturnDto,
  ) {
    return this.returnsService.create(
      createReturnDto,
    )
  }
}