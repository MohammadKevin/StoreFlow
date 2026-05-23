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

import { CategoriesService } from './categories.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { QueryCategoryDto } from './dto/query-category.dto'

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryCategoryDto,
  ) {
    return this.categoriesService.findAll(query)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(
      createCategoryDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      id,
      updateCategoryDto,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }
}