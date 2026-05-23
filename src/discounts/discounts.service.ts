import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateDiscountDto } from './dto/create-discount.dto'
import { UpdateDiscountDto } from './dto/update-discount.dto'
import { QueryDiscountDto } from './dto/query-discount.dto'

@Injectable()
export class DiscountsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryDiscountDto) {
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
            code: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        ],
      }),

      ...(query.storeId && {
        storeId: query.storeId,
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.discount.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.discount.count({
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
    const discount =
      await this.prisma.discount.findUnique({
        where: {
          id,
        },
      })

    if (!discount) {
      throw new NotFoundException(
        'Discount not found',
      )
    }

    return discount
  }

  async create(
    createDiscountDto: CreateDiscountDto,
  ) {
    if (createDiscountDto.code) {
      const existingCode =
        await this.prisma.discount.findFirst({
          where: {
            code: createDiscountDto.code,
          },
        })

      if (existingCode) {
        throw new BadRequestException(
          'Discount code already exists',
        )
      }
    }

    return this.prisma.discount.create({
      data: {
        ...createDiscountDto,

        isActive:
          createDiscountDto.isActive ??
          true,
      },
    })
  }

  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ) {
    const discount =
      await this.prisma.discount.findUnique({
        where: {
          id,
        },
      })

    if (!discount) {
      throw new NotFoundException(
        'Discount not found',
      )
    }

    if (
      updateDiscountDto.code &&
      updateDiscountDto.code !==
        discount.code
    ) {
      const existingCode =
        await this.prisma.discount.findFirst({
          where: {
            code: updateDiscountDto.code,
          },
        })

      if (existingCode) {
        throw new BadRequestException(
          'Discount code already exists',
        )
      }
    }

    return this.prisma.discount.update({
      where: {
        id,
      },

      data: updateDiscountDto,
    })
  }

  async remove(id: string) {
    const discount =
      await this.prisma.discount.findUnique({
        where: {
          id,
        },
      })

    if (!discount) {
      throw new NotFoundException(
        'Discount not found',
      )
    }

    await this.prisma.discount.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Discount deleted successfully',
    }
  }

  async toggleStatus(id: string) {
    const discount =
      await this.prisma.discount.findUnique({
        where: {
          id,
        },
      })

    if (!discount) {
      throw new NotFoundException(
        'Discount not found',
      )
    }

    return this.prisma.discount.update({
      where: {
        id,
      },

      data: {
        isActive: !discount.isActive,
      },
    })
  }
}