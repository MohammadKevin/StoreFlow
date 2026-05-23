import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async sales(storeId?: string) {
    return this.prisma.sale.findMany({
      where: {
        ...(storeId && {
          storeId,
        }),
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        cashier: true,

        customer: true,

        payments: true,

        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  async profits(storeId?: string) {
    const sales =
      await this.prisma.sale.aggregate({
        where: {
          ...(storeId && {
            storeId,
          }),
        },

        _sum: {
          totalProfit: true,
          totalAmount: true,
        },

        _count: true,
      })

    const expenses =
      await this.prisma.expense.aggregate({
        where: {
          ...(storeId && {
            storeId,
          }),
        },

        _sum: {
          amount: true,
        },
      })

    const grossProfit =
      sales._sum.totalProfit || 0

    const expense =
      expenses._sum.amount || 0

    const netProfit =
      grossProfit - expense

    return {
      grossProfit,

      expenses: expense,

      netProfit,

      totalSales:
        sales._sum.totalAmount || 0,

      totalTransactions:
        sales._count || 0,
    }
  }

  async products(storeId?: string) {
    return this.prisma.saleItem.groupBy({
      by: ['productId'],

      _sum: {
        quantity: true,
        subtotal: true,
        profit: true,
      },

      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
    })
  }

  async returns(storeId?: string) {
    return this.prisma.returnTransaction.findMany(
      {
        where: {
          sale: {
            ...(storeId && {
              storeId,
            }),
          },
        },

        include: {
          sale: true,

          items: {
            include: {
              product: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      },
    )
  }

  async cashiers(storeId?: string) {
    return this.prisma.sale.groupBy({
      by: ['cashierId'],

      where: {
        ...(storeId && {
          storeId,
        }),
      },

      _sum: {
        totalAmount: true,
        totalProfit: true,
      },

      _count: true,

      orderBy: {
        _sum: {
          totalAmount: 'desc',
        },
      },
    })
  }

  async purchases(storeId?: string) {
    return this.prisma.purchase.findMany({
      where: {
        ...(storeId && {
          storeId,
        }),
      },

      include: {
        supplier: true,

        items: {
          include: {
            product: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async stocks(storeId?: string) {
    return this.prisma.stockMovement.findMany({
      where: {
        ...(storeId && {
          storeId,
        }),
      },

      include: {
        product: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}