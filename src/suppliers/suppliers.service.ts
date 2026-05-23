import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'
import { QuerySupplierDto } from './dto/query-supplier.dto'

@Injectable()
export class SuppliersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QuerySupplierDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.storeId && {
        storeId: query.storeId,
      }),

      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },

          {
            phone: {
              contains: query.search,
            },
          },

          {
            email: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          purchases: true,
        },
      }),

      this.prisma.supplier.count({
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
    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id,
        },

        include: {
          purchases: true,
        },
      })

    if (!supplier) {
      throw new NotFoundException(
        'Supplier not found',
      )
    }

    return supplier
  }

  async create(
    createSupplierDto: CreateSupplierDto,
  ) {
    return this.prisma.supplier.create({
      data: createSupplierDto,
    })
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id,
        },
      })

    if (!supplier) {
      throw new NotFoundException(
        'Supplier not found',
      )
    }

    return this.prisma.supplier.update({
      where: {
        id,
      },

      data: updateSupplierDto,
    })
  }

  async remove(id: string) {
    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id,
        },
      })

    if (!supplier) {
      throw new NotFoundException(
        'Supplier not found',
      )
    }

    await this.prisma.supplier.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Supplier deleted successfully',
    }
  }
}