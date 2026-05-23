import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { QueryCustomerDto } from './dto/query-customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryCustomerDto) {
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
      this.prisma.customer.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          store: true,
        },
      }),

      this.prisma.customer.count({
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
    const customer =
      await this.prisma.customer.findUnique({
        where: {
          id,
        },

        include: {
          store: true,
        },
      })

    if (!customer) {
      throw new NotFoundException(
        'Customer not found',
      )
    }

    return customer
  }

  async create(
    createCustomerDto: CreateCustomerDto,
  ) {
    if (createCustomerDto.phone) {
      const existingPhone =
        await this.prisma.customer.findFirst({
          where: {
            phone:
              createCustomerDto.phone,
          },
        })

      if (existingPhone) {
        throw new BadRequestException(
          'Phone already exists',
        )
      }
    }

    const store =
      await this.prisma.store.findUnique({
        where: {
          id: createCustomerDto.storeId,
        },
      })

    if (!store) {
      throw new NotFoundException(
        'Store not found',
      )
    }

    return this.prisma.customer.create({
      data: {
        name: createCustomerDto.name,

        storeId: createCustomerDto.storeId,

        phone: createCustomerDto.phone,

        email: createCustomerDto.email,

        address: createCustomerDto.address,
      },

      include: {
        store: true,
      },
    })
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer =
      await this.prisma.customer.findUnique({
        where: {
          id,
        },
      })

    if (!customer) {
      throw new NotFoundException(
        'Customer not found',
      )
    }

    if (
      updateCustomerDto.phone &&
      updateCustomerDto.phone !==
        customer.phone
    ) {
      const existingPhone =
        await this.prisma.customer.findFirst({
          where: {
            phone:
              updateCustomerDto.phone,
          },
        })

      if (existingPhone) {
        throw new BadRequestException(
          'Phone already exists',
        )
      }
    }

    if (updateCustomerDto.storeId) {
      const store =
        await this.prisma.store.findUnique({
          where: {
            id: updateCustomerDto.storeId,
          },
        })

      if (!store) {
        throw new NotFoundException(
          'Store not found',
        )
      }
    }

    return this.prisma.customer.update({
      where: {
        id,
      },

      data: {
        ...updateCustomerDto,
      },

      include: {
        store: true,
      },
    })
  }

  async remove(id: string) {
    const customer =
      await this.prisma.customer.findUnique({
        where: {
          id,
        },
      })

    if (!customer) {
      throw new NotFoundException(
        'Customer not found',
      )
    }

    await this.prisma.customer.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Customer deleted successfully',
    }
  }
}
