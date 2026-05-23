import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'

import {
    PaymentMethod,
    PaymentStatus,
    StockMovementType,
} from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateSaleDto } from './dto/create-sale.dto'
import { PaySaleDto } from './dto/pay-sale.dto'
import { QuerySaleDto } from './dto/query-sale.dto'

@Injectable()
export class SalesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(query: QuerySaleDto) {
        const page = Number(query.page) || 1

        const limit = Number(query.limit) || 10

        const skip = (page - 1) * limit

        const where: any = {
            ...(query.storeId && {
                storeId: query.storeId,
            }),

            ...(query.cashierId && {
                cashierId: query.cashierId,
            }),

            ...(query.customerId && {
                customerId: query.customerId,
            }),
        }

        const [data, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,

                skip,

                take: limit,

                orderBy: {
                    createdAt: 'desc',
                },

                include: {
                    cashier: true,

                    customer: true,

                    discount: true,

                    items: {
                        include: {
                            product: true,
                        },
                    },

                    payments: true,
                },
            }),

            this.prisma.sale.count({
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
        const sale =
            await this.prisma.sale.findUnique({
                where: {
                    id,
                },

                include: {
                    store: true,

                    cashier: true,

                    customer: true,

                    discount: true,

                    items: {
                        include: {
                            product: true,
                        },
                    },

                    payments: true,

                    histories: true,
                }
            })

        if (!sale) {
            throw new NotFoundException(
                'Sale not found',
            )
        }

        return sale
    }

    async create(createSaleDto: CreateSaleDto) {
        let subtotalAmount = 0

        const itemsData: {
            productId: string
            quantity: number
            costPrice: number
            sellPrice: number
            subtotal: number
            profit: number
        }[] = []

        for (const item of createSaleDto.items) {
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

            if (!product.isActive) {
                throw new BadRequestException(
                    `${product.name} inactive`,
                )
            }

            if (
                product.trackStock &&
                product.stock < item.quantity
            ) {
                throw new BadRequestException(
                    `${product.name} stock insufficient`,
                )
            }

            const subtotal =
                product.sellPrice * item.quantity

            const profit =
                (product.sellPrice -
                    product.costPrice) *
                item.quantity

            subtotalAmount += subtotal

            itemsData.push({
                productId: product.id,

                quantity: item.quantity,

                costPrice: product.costPrice,

                sellPrice: product.sellPrice,

                subtotal,

                profit,
            })
        }

        let discountAmount = 0

        if (createSaleDto.discountId) {
            const discount =
                await this.prisma.discount.findUnique({
                    where: {
                        id: createSaleDto.discountId,
                    },
                })

            if (
                discount &&
                discount.isActive
            ) {
                if (
                    discount.startDate &&
                    new Date() < discount.startDate
                ) {
                    throw new BadRequestException(
                        'Discount not started',
                    )
                }

                if (
                    discount.endDate &&
                    new Date() > discount.endDate
                ) {
                    throw new BadRequestException(
                        'Discount expired',
                    )
                }

                if (
                    discount.minPurchase &&
                    subtotalAmount <
                    discount.minPurchase
                ) {
                    throw new BadRequestException(
                        'Minimum purchase not reached',
                    )
                }

                if (
                    discount.type === 'PERCENTAGE'
                ) {
                    discountAmount =
                        (subtotalAmount *
                            discount.value) /
                        100
                } else {
                    discountAmount = discount.value
                }

                if (
                    discount.maxDiscount &&
                    discountAmount >
                    discount.maxDiscount
                ) {
                    discountAmount =
                        discount.maxDiscount
                }
            }
        }

        const totalAmount =
            subtotalAmount - discountAmount

        const totalProfit = itemsData.reduce(
            (acc, item) => acc + item.profit,
            0,
        )

        const invoiceNumber = `INV-${Date.now()}`

        const sale = await this.prisma.sale.create({
            data: {
                invoiceNumber,

                storeId: createSaleDto.storeId,

                cashierId:
                    createSaleDto.cashierId,

                customerId:
                    createSaleDto.customerId ||
                    null,

                discountId:
                    createSaleDto.discountId ||
                    null,

                subtotalAmount,

                discountAmount,

                taxAmount: 0,

                totalAmount,

                totalProfit,

                paymentMethod:
                    PaymentMethod.CASH,

                paymentStatus:
                    PaymentStatus.PENDING,

                paidAmount: 0,

                items: {
                    create: itemsData,
                },
            },

            include: {
                items: true,
            },
        })

        for (const item of createSaleDto.items) {
            const product =
                await this.prisma.product.findUnique({
                    where: {
                        id: item.productId,
                    },
                })

            if (!product) {
                continue
            }

            if (product.trackStock) {
                const beforeStock =
                    product.stock

                const afterStock =
                    beforeStock - item.quantity

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
                        storeId:
                            createSaleDto.storeId,

                        productId: product.id,

                        type:
                            StockMovementType.SALE,

                        quantity: item.quantity,

                        beforeStock,

                        afterStock,

                        note: `Sale ${sale.invoiceNumber}`,
                    },
                })
            }
        }

        await this.prisma.transactionHistory.create(
            {
                data: {
                    saleId: sale.id,

                    action: 'SALE_CREATED',

                    description: `Transaction ${sale.invoiceNumber} created`,
                },
            },
        )

        return sale
    }

    async pay(
        id: string,
        paySaleDto: PaySaleDto,
    ) {
        const sale =
            await this.prisma.sale.findUnique({
                where: {
                    id,
                },
            })

        if (!sale) {
            throw new NotFoundException(
                'Sale not found',
            )
        }

        if (
            sale.paymentStatus ===
            PaymentStatus.PAID
        ) {
            throw new BadRequestException(
                'Sale already paid',
            )
        }

        if (
            paySaleDto.paidAmount <
            sale.totalAmount
        ) {
            throw new BadRequestException(
                'Insufficient payment',
            )
        }

        const changeAmount =
            paySaleDto.paidAmount -
            sale.totalAmount

        const updatedSale =
            await this.prisma.sale.update({
                where: {
                    id,
                },

                data: {
                    paymentMethod:
                        paySaleDto.paymentMethod,

                    paymentStatus:
                        PaymentStatus.PAID,

                    paidAmount:
                        paySaleDto.paidAmount,

                    changeAmount,
                },
            })

        await this.prisma.salePayment.create({
            data: {
                saleId: sale.id,

                method:
                    paySaleDto.paymentMethod,

                amount:
                    paySaleDto.paidAmount,
            },
        })

        await this.prisma.transactionHistory.create(
            {
                data: {
                    saleId: sale.id,

                    action: 'SALE_PAID',

                    description: `Payment completed`,
                },
            },
        )

        return updatedSale
    }
}