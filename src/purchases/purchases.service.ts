import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  PurchaseStatus,
  StockMovementType,
} from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { QueryPurchaseDto } from './dto/query-purchase.dto'

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryPurchaseDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.storeId && {
        storeId: query.storeId,
      }),

      ...(query.supplierId && {
        supplierId: query.supplierId,
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          supplier: true,

          items: {
            include: {
              product: true,
            },
          },
        },
      }),

      this.prisma.purchase.count({
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
    const purchase =
      await this.prisma.purchase.findUnique({
        where: {
          id,
        },

        include: {
          supplier: true,

          items: {
            include: {
              product: true,
            },
          },
        },
      })

    if (!purchase) {
      throw new NotFoundException(
        'Purchase not found',
      )
    }

    return purchase
  }

  async create(
    createPurchaseDto: CreatePurchaseDto,
  ) {
    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id: createPurchaseDto.supplierId,
        },
      })

    if (!supplier) {
      throw new NotFoundException(
        'Supplier not found',
      )
    }

    let totalAmount = 0

    const itemsData: {
      productId: string
      quantity: number
      costPrice: number
      subtotal: number
    }[] = []

    for (const item of createPurchaseDto.items) {
      const product =
        await this.prisma.product.findUnique({
          where: {
            id: item.productId,
          },
        })

      if (!product) {
        throw new NotFoundException(
          'Product not found',
        )
      }

      const subtotal =
        item.quantity * item.costPrice

      totalAmount += subtotal

      itemsData.push({
        productId: item.productId,

        quantity: item.quantity,

        costPrice: item.costPrice,

        subtotal,
      })
    }

    const invoiceNumber = `PUR-${Date.now()}`

    const purchase =
      await this.prisma.purchase.create({
        data: {
          storeId: createPurchaseDto.storeId,

          supplierId:
            createPurchaseDto.supplierId,

          invoiceNumber,

          totalAmount,

          notes: createPurchaseDto.notes,

          status:
            PurchaseStatus.COMPLETED,

          items: {
            create: itemsData,
          },
        },

        include: {
          items: true,
        },
      })

    for (const item of createPurchaseDto.items) {
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

          costPrice: item.costPrice,
        },
      })

      await this.prisma.stockMovement.create({
        data: {
          storeId:
            createPurchaseDto.storeId,

          productId: product.id,

          type:
            StockMovementType.IN,

          quantity: item.quantity,

          beforeStock,

          afterStock,

          note: `Purchase ${purchase.invoiceNumber}`,
        },
      })
    }

    return purchase
  }
}