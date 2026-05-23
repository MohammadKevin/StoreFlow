import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { UploadsService } from 'src/uploads/uploads.service'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { QueryProductDto } from './dto/query-product.dto'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly uploadsService: UploadsService,
  ) {}

  async findAll(query: QueryProductDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.search && {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
      }),

      ...(query.storeId && {
        storeId: query.storeId,
      }),

      ...(query.categoryId && {
        categoryId: query.categoryId,
      }),

      ...(query.barcode && {
        barcode: query.barcode,
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          category: true,
          store: true,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ])

    return {
      data,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(id: string) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          category: true,
          store: true,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    return product
  }

  async create(
  createProductDto: CreateProductDto,
) {
  const barcode = `BR${Date.now()}`

  const sku = `SKU-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`

  return this.prisma.product.create({
    data: {
      ...createProductDto,

      barcode,

      sku,

      stock: createProductDto.stock || 0,

      minStock:
        createProductDto.minStock || 5,

      trackStock:
        createProductDto.trackStock ?? true,
    },

    include: {
      category: true,
      store: true,
    },
  })
}

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    return this.prisma.product.update({
      where: {
        id,
      },

      data: updateProductDto,

      include: {
        category: true,
        store: true,
      },
    })
  }

  async remove(id: string) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    await this.prisma.product.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Product deleted successfully',
    }
  }

  async toggleStatus(id: string) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    return this.prisma.product.update({
      where: {
        id,
      },

      data: {
        isActive: !product.isActive,
      },
    })
  }

  async uploadImage(
    id: string,
    file: Express.Multer.File,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    const uploaded =
      await this.uploadsService.uploadProductImage(
        file,
      )

    return this.prisma.product.update({
      where: {
        id,
      },

      data: {
        imageUrl: uploaded.url,
      },
    })
  }
}