import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { QueryCategoryDto } from './dto/query-category.dto'

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryCategoryDto) {
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
      this.prisma.category.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.category.count({
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
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      })

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      )
    }

    return category
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ) {
    const existingCategory =
      await this.prisma.category.findFirst({
        where: {
          name: createCategoryDto.name,
        },
      })

    if (existingCategory) {
      throw new BadRequestException(
        'Category already exists',
      )
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    })
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      })

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      )
    }

    return this.prisma.category.update({
      where: {
        id,
      },

      data: updateCategoryDto,
    })
  }

  async remove(id: string) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      })

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      )
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Category deleted successfully',
    }
  }
}