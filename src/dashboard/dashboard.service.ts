import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async summary(storeId?: string) {
        const where = {
            ...(storeId && {
                storeId,
            }),
        }

        const today = new Date()

        today.setHours(0, 0, 0, 0)

        const [
            sales,
            purchases,
            products,
            customers,
            returns,
            expenses,
            lowStock,
            todaySales,
        ] = await Promise.all([
            this.prisma.sale.aggregate({
                where,

                _sum: {
                    totalAmount: true,
                    totalProfit: true,
                },

                _count: true,
            }),

            this.prisma.purchase.aggregate({
                where,

                _sum: {
                    totalAmount: true,
                },

                _count: true,
            }),

            this.prisma.product.count({
                where,
            }),

            this.prisma.customer.count({
                where,
            }),

            this.prisma.returnTransaction.aggregate({
                where: {
                    sale: where,
                },

                _sum: {
                    totalRefund: true,
                },

                _count: true,
            }),

            this.prisma.expense.aggregate({
                where,

                _sum: {
                    amount: true,
                },
            }),

            this.prisma.product.count({
                where: {
                    ...where,

                    stock: {
                        lte: 5,
                    },
                },
            }),

            this.prisma.sale.aggregate({
                where: {
                    ...where,

                    createdAt: {
                        gte: today,
                    },
                },

                _sum: {
                    totalAmount: true,
                },

                _count: true,
            }),
        ])

        return {
            totalSales:
                sales._sum.totalAmount || 0,

            totalProfit:
                sales._sum.totalProfit || 0,

            totalTransactions:
                sales._count || 0,

            totalPurchases:
                purchases._sum.totalAmount || 0,

            totalPurchaseTransactions:
                purchases._count || 0,

            totalProducts: products,

            totalCustomers: customers,

            totalReturns:
                returns._sum.totalRefund || 0,

            totalReturnTransactions:
                returns._count || 0,

            totalExpenses:
                expenses._sum.amount || 0,

            lowStockProducts: lowStock,

            todaySales:
                todaySales._sum.totalAmount || 0,

            todayTransactions:
                todaySales._count || 0,
        }
    }

    async salesChart(storeId?: string) {
        const days: {
            date: string
            total: number
        }[] = []

        for (let i = 6; i >= 0; i--) {
            const start = new Date()

            start.setDate(start.getDate() - i)

            start.setHours(0, 0, 0, 0)

            const end = new Date(start)

            end.setHours(23, 59, 59, 999)

            const sales =
                await this.prisma.sale.aggregate({
                    where: {
                        ...(storeId && {
                            storeId,
                        }),

                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                    },

                    _sum: {
                        totalAmount: true,
                    },
                })

            days.push({
                date: start.toISOString(),

                total:
                    sales._sum.totalAmount || 0,
            })
        }

        return days
    }

    async topProducts(storeId?: string) {
        return this.prisma.saleItem.groupBy({
            by: ['productId'],

            _sum: {
                quantity: true,
                subtotal: true,
            },

            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },

            take: 10,
        })
    }

    async topCashiers(storeId?: string) {
        return this.prisma.sale.groupBy({
            by: ['cashierId'],

            where: {
                ...(storeId && {
                    storeId,
                }),
            },

            _sum: {
                totalAmount: true,
            },

            _count: true,

            orderBy: {
                _sum: {
                    totalAmount: 'desc',
                },
            },

            take: 10,
        })
    }

    async recentSales(storeId?: string) {
        return this.prisma.sale.findMany({
            where: {
                ...(storeId && {
                    storeId,
                }),
            },

            take: 10,

            orderBy: {
                createdAt: 'desc',
            },

            include: {
                cashier: true,

                customer: true,

                payments: true,
            },
        })
    }

    async lowStock(storeId?: string) {
        return this.prisma.product.findMany({
            where: {
                ...(storeId && {
                    storeId,
                }),

                stock: {
                    lte: 5,
                },
            },

            orderBy: {
                stock: 'asc',
            },

            include: {
                category: true,
            },
        })
    }
}