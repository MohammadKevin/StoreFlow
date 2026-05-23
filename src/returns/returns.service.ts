import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { StockMovementType } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateReturnDto } from './dto/create-return.dto'
import { QueryReturnDto } from './dto/query-return.dto'

@Injectable()
export class ReturnsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryReturnDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.saleId && {
        saleId: query.saleId,
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.returnTransaction.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          sale: true,

          items: {
            include: {
              product: true,
            },
          },
        },
      }),

      this.prisma.returnTransaction.count({
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
    const data =
      await this.prisma.returnTransaction.findUnique(
        {
          where: {
            id,
          },

          include: {
            sale: true,

            items: {
              include: {
                product: true,
              },
            },
          },
        },
      )

    if (!data) {
      throw new NotFoundException(
        'Return transaction not found',
      )
    }

    return data
  }

  async create(
    createReturnDto: CreateReturnDto,
  ) {
    const sale =
      await this.prisma.sale.findUnique({
        where: {
          id: createReturnDto.saleId,
        },

        include: {
          items: true,
        },
      })

    if (!sale) {
      throw new NotFoundException(
        'Sale not found',
      )
    }

    let totalRefund = 0

    const returnItems: {
      productId: string
      quantity: number
      subtotal: number
    }[] = []

    for (const item of createReturnDto.items) {
      const saleItem = sale.items.find(
        (saleItem) =>
          saleItem.productId ===
          item.productId,
      )

      if (!saleItem) {
        throw new BadRequestException(
          'Product not found in transaction',
        )
      }

      if (
        item.quantity >
        saleItem.quantity
      ) {
        throw new BadRequestException(
          'Return quantity exceeds purchase quantity',
        )
      }

      const subtotal =
        saleItem.sellPrice *
        item.quantity

      totalRefund += subtotal

      returnItems.push({
        productId: item.productId,

        quantity: item.quantity,

        subtotal,
      })
    }

    const returnTransaction =
      await this.prisma.returnTransaction.create(
        {
          data: {
            saleId: sale.id,

            reason:
              createReturnDto.reason,

            totalRefund,

            items: {
              create: returnItems,
            },
          },

          include: {
            items: true,
          },
        },
      )

    for (const item of createReturnDto.items) {
      const product =
        await this.prisma.product.findUnique({
          where: {
            id: item.productId,
          },
        })

      if (!product) {
        continue
      }

      const beforeStock = product.stock

      const afterStock =
        beforeStock + item.quantity

      await this.prisma.product.update({
        where: {
          id: product.id,
        },

        data: {
          stock: afterStock,
        },
      })

      await this.prisma.stockMovement.create({
        data: {
          storeId: sale.storeId,

          productId: product.id,

          type:
            StockMovementType.RETURN,

          quantity: item.quantity,

          beforeStock,

          afterStock,

          note: `Return ${returnTransaction.id}`,
        },
      })
    }

    await this.prisma.transactionHistory.create(
      {
        data: {
          saleId: sale.id,

          action: 'RETURN_CREATED',

          description:
            'Return transaction created',
        },
      },
    )

    return returnTransaction
  }
}