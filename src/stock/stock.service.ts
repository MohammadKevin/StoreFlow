import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { StockMovementType } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { StockInDto } from './dto/stock-in.dto'
import { StockOutDto } from './dto/stock-out.dto'
import { StockAdjustmentDto } from './dto/stock-adjustment.dto'
import { QueryStockDto } from './dto/query-stock.dto'

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async history(query: QueryStockDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.storeId && {
        storeId: query.storeId,
      }),

      ...(query.productId && {
        productId: query.productId,
      }),

      ...(query.type && {
        type: query.type,
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          product: true,
        },
      }),

      this.prisma.stockMovement.count({
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

  async stockIn(stockInDto: StockInDto) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: stockInDto.productId,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    const beforeStock = product.stock

    const afterStock =
      beforeStock + stockInDto.quantity

    await this.prisma.product.update({
      where: {
        id: product.id,
      },

      data: {
        stock: afterStock,
      },
    })

    return this.prisma.stockMovement.create({
      data: {
        storeId: stockInDto.storeId,

        productId: product.id,

        type: StockMovementType.IN,

        quantity: stockInDto.quantity,

        beforeStock,

        afterStock,

        note: stockInDto.note,
      },
    })
  }

  async stockOut(stockOutDto: StockOutDto) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: stockOutDto.productId,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    if (product.stock < stockOutDto.quantity) {
      throw new BadRequestException(
        'Insufficient stock',
      )
    }

    const beforeStock = product.stock

    const afterStock =
      beforeStock - stockOutDto.quantity

    await this.prisma.product.update({
      where: {
        id: product.id,
      },

      data: {
        stock: afterStock,
      },
    })

    return this.prisma.stockMovement.create({
      data: {
        storeId: stockOutDto.storeId,

        productId: product.id,

        type: StockMovementType.PRIBADI,

        quantity: stockOutDto.quantity,

        beforeStock,

        afterStock,

        note: stockOutDto.reason,
      },
    })
  }

  async adjustment(
    stockAdjustmentDto: StockAdjustmentDto,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: stockAdjustmentDto.productId,
        },
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      )
    }

    const beforeStock = product.stock

    const afterStock =
      stockAdjustmentDto.newStock

    await this.prisma.product.update({
      where: {
        id: product.id,
      },

      data: {
        stock: afterStock,
      },
    })

    return this.prisma.stockMovement.create({
      data: {
        storeId:
          stockAdjustmentDto.storeId,

        productId: product.id,

        type:
          StockMovementType.ADJUSTMENT,

        quantity:
          afterStock - beforeStock,

        beforeStock,

        afterStock,

        note: stockAdjustmentDto.note,
      },
    })
  }

  async lowStock(storeId?: string) {
    const products =
      await this.prisma.product.findMany({
        where: {
          ...(storeId && {
            storeId,
          }),
        },

        include: {
          category: true,
          store: true,
        },
      })

    return products.filter(
      (product) =>
        product.stock <= product.minStock,
    )
  }
}