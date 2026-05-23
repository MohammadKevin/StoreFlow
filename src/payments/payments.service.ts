import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PaymentStatus } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreatePaymentDto } from './dto/create-payment.dto'
import { QueryPaymentDto } from './dto/query-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryPaymentDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.saleId && {
        saleId: query.saleId,
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.salePayment.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          sale: true,
        },
      }),

      this.prisma.salePayment.count({
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
    const payment =
      await this.prisma.salePayment.findUnique(
        {
          where: {
            id,
          },

          include: {
            sale: true,
          },
        },
      )

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      )
    }

    return payment
  }

  async create(
    createPaymentDto: CreatePaymentDto,
  ) {
    const sale =
      await this.prisma.sale.findUnique({
        where: {
          id: createPaymentDto.saleId,
        },

        include: {
          payments: true,
        },
      })

    if (!sale) {
      throw new NotFoundException(
        'Sale not found',
      )
    }

    const totalPaid =
      sale.payments.reduce(
        (acc, payment) =>
          acc + payment.amount,
        0,
      )

    const remaining =
      sale.totalAmount - totalPaid

    if (
      createPaymentDto.amount >
      remaining
    ) {
      throw new BadRequestException(
        'Payment exceeds remaining bill',
      )
    }

    const payment =
      await this.prisma.salePayment.create({
        data: {
          saleId: sale.id,

          method:
            createPaymentDto.method,

          amount:
            createPaymentDto.amount,
        },
      })

    const newPaidAmount =
      totalPaid +
      createPaymentDto.amount

    const paymentStatus =
      newPaidAmount >= sale.totalAmount
        ? PaymentStatus.PAID
        : PaymentStatus.PENDING

    await this.prisma.sale.update({
      where: {
        id: sale.id,
      },

      data: {
        paidAmount: newPaidAmount,

        paymentMethod:
          createPaymentDto.method,

        paymentStatus,
      },
    })

    await this.prisma.transactionHistory.create(
      {
        data: {
          saleId: sale.id,

          action: 'PAYMENT_CREATED',

          description: `Payment ${createPaymentDto.amount}`,
        },
      },
    )

    return payment
  }
}