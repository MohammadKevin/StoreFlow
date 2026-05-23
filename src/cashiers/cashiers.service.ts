import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateCashierDto } from './dto/create-cashier.dto'
import { UpdateCashierDto } from './dto/update-cashier.dto'
import { QueryCashierDto } from './dto/query-cashier.dto'

@Injectable()
export class CashiersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryCashierDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.storeId && {
        storeId: query.storeId,
      }),

      ...(query.search && {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.cashier.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          name: true,
          isActive: true,
          createdAt: true,

          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.cashier.count({
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
    const cashier =
      await this.prisma.cashier.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          name: true,
          isActive: true,
          createdAt: true,

          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

    if (!cashier) {
      throw new NotFoundException(
        'Cashier not found',
      )
    }

    return cashier
  }

  async create(
    createCashierDto: CreateCashierDto,
  ) {
    const existingPin =
      await this.prisma.cashier.findFirst({
        where: {
          storeId: createCashierDto.storeId,

          pin: createCashierDto.pin,
        },
      })

    if (existingPin) {
      throw new BadRequestException(
        'PIN already used',
      )
    }

    return this.prisma.cashier.create({
      data: createCashierDto,

      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    })
  }

  async update(
    id: string,
    updateCashierDto: UpdateCashierDto,
  ) {
    const cashier =
      await this.prisma.cashier.findUnique({
        where: {
          id,
        },
      })

    if (!cashier) {
      throw new NotFoundException(
        'Cashier not found',
      )
    }

    if (updateCashierDto.pin) {
      const existingPin =
        await this.prisma.cashier.findFirst({
          where: {
            storeId: cashier.storeId,

            pin: updateCashierDto.pin,

            NOT: {
              id,
            },
          },
        })

      if (existingPin) {
        throw new BadRequestException(
          'PIN already used',
        )
      }
    }

    return this.prisma.cashier.update({
      where: {
        id,
      },

      data: updateCashierDto,

      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true,
      },
    })
  }

  async toggleStatus(id: string) {
    const cashier =
      await this.prisma.cashier.findUnique({
        where: {
          id,
        },
      })

    if (!cashier) {
      throw new NotFoundException(
        'Cashier not found',
      )
    }

    return this.prisma.cashier.update({
      where: {
        id,
      },

      data: {
        isActive: !cashier.isActive,
      },

      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })
  }
}
