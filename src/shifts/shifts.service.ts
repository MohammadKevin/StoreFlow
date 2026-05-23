import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { ShiftStatus } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { OpenShiftDto } from './dto/open-shift.dto'
import { CloseShiftDto } from './dto/close-shift.dto'
import { QueryShiftDto } from './dto/query-shift.dto'

@Injectable()
export class ShiftsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryShiftDto) {
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
    }

    const [data, total] = await Promise.all([
      this.prisma.cashierShift.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          openedAt: 'desc',
        },

        include: {
          cashier: true,
          store: true,
        },
      }),

      this.prisma.cashierShift.count({
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
    const shift =
      await this.prisma.cashierShift.findUnique(
        {
          where: {
            id,
          },

          include: {
            cashier: true,
            store: true,
          },
        },
      )

    if (!shift) {
      throw new NotFoundException(
        'Shift not found',
      )
    }

    return shift
  }

  async open(
    openShiftDto: OpenShiftDto,
  ) {
    const existingShift =
      await this.prisma.cashierShift.findFirst(
        {
          where: {
            cashierId:
              openShiftDto.cashierId,

            status: ShiftStatus.OPEN,
          },
        },
      )

    if (existingShift) {
      throw new BadRequestException(
        'Cashier still has open shift',
      )
    }

    return this.prisma.cashierShift.create({
      data: {
        storeId: openShiftDto.storeId,

        cashierId:
          openShiftDto.cashierId,

        startCash:
          openShiftDto.startCash,

        totalSales: 0,

        status: ShiftStatus.OPEN,
      },
    })
  }

  async close(
    id: string,
    closeShiftDto: CloseShiftDto,
  ) {
    const shift =
      await this.prisma.cashierShift.findUnique(
        {
          where: {
            id,
          },
        },
      )

    if (!shift) {
      throw new NotFoundException(
        'Shift not found',
      )
    }

    if (
      shift.status ===
      ShiftStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Shift already closed',
      )
    }

    const sales =
      await this.prisma.sale.aggregate({
        where: {
          cashierId: shift.cashierId,

          createdAt: {
            gte: shift.openedAt,
          },
        },

        _sum: {
          totalAmount: true,
        },
      })

    const totalSales =
      sales._sum.totalAmount || 0

    return this.prisma.cashierShift.update({
      where: {
        id,
      },

      data: {
        endCash:
          closeShiftDto.endCash,

        totalSales,

        status: ShiftStatus.CLOSED,

        closedAt: new Date(),
      },
    })
  }
}