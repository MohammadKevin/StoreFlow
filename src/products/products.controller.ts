import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'

import { ProductsService } from './products.service'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { QueryProductDto } from './dto/query-product.dto'

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryProductDto,
  ) {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id)
  }

  @Post()
  async create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(
      createProductDto,
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body()
    updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(
      id,
      updateProductDto,
    )
  }

  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: string,
  ) {
    return this.productsService.toggleStatus(id)
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.productsService.uploadImage(
      id,
      file,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }
}