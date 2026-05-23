import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { QueryStoreDto } from './dto/query-store.dto'

@Injectable()
export class StoresService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryStoreDto) {
    const page = Number(query.page) || 1

    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const where: any = {
      ...(query.search && {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.store.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.store.count({
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
    const store =
      await this.prisma.store.findUnique({
        where: {
          id,
        },
      })

    if (!store) {
      throw new NotFoundException(
        'Store not found',
      )
    }

    return store
  }

  async create(
    createStoreDto: CreateStoreDto,
  ) {
    const existingStore =
      await this.prisma.store.findFirst({
        where: {
          name: createStoreDto.name,
        },
      })

    if (existingStore) {
      throw new BadRequestException(
        'Store already exists',
      )
    }

    return this.prisma.store.create({
      data: createStoreDto,
    })
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ) {
    const store =
      await this.prisma.store.findUnique({
        where: {
          id,
        },
      })

    if (!store) {
      throw new NotFoundException(
        'Store not found',
      )
    }

    return this.prisma.store.update({
      where: {
        id,
      },

      data: updateStoreDto,
    })
  }

  async toggleStatus(id: string) {
    const store =
      await this.prisma.store.findUnique({
        where: {
          id,
        },
      })

    if (!store) {
      throw new NotFoundException(
        'Store not found',
      )
    }

    return this.prisma.store.update({
      where: {
        id,
      },

      data: {
        isActive: !store.isActive,
      },
    })
  }
}
