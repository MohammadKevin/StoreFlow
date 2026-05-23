import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateBarcodeDto } from './dto/create-barcode.dto'
import { QueryBarcodeDto } from './dto/query-barcode.dto'
import { PrintBarcodeDto } from './dto/print-barcode.dto'

@Injectable()
export class BarcodesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryBarcodeDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },

          {
            barcode: {
              contains: query.search,
            },
          },
        ],
      }),

      ...(query.storeId && {
        storeId: query.storeId,
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

  async create(
    createBarcodeDto: CreateBarcodeDto,
  ) {
    const barcode = `BR${Date.now()}`

    const sku = `SKU-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`

    const product =
      await this.prisma.product.create({
        data: {
          name: createBarcodeDto.name,

          categoryId:
            createBarcodeDto.categoryId,

          storeId: createBarcodeDto.storeId,

          barcode,

          sku,

          stock: createBarcodeDto.quantity,

          costPrice:
            createBarcodeDto.costPrice,

          sellPrice:
            createBarcodeDto.sellPrice,
        },
      })

    await this.prisma.stockMovement.create({
      data: {
        storeId: createBarcodeDto.storeId,

        productId: product.id,

        type: 'IN',

        quantity: createBarcodeDto.quantity,

        beforeStock: 0,

        afterStock:
          createBarcodeDto.quantity,

        note: 'Initial stock from barcode',
      },
    })

    return product
  }

  async findByBarcode(barcode: string) {
    const product =
      await this.prisma.product.findFirst({
        where: {
          barcode,
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

  async print(
  printBarcodeDto: PrintBarcodeDto,
) {
  const results: {
    productId: string
    name: string
    barcode: string | null
    sellPrice: number
  }[] = []

  for (const item of printBarcodeDto.items) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      })

    if (!product) {
      throw new NotFoundException(
        `Product ${item.productId} not found`,
      )
    }

    for (let i = 0; i < item.qty; i++) {
      results.push({
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        sellPrice: product.sellPrice,
      })
    }
  }

  return results
}
}