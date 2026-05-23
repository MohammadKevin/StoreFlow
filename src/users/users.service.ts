import {
    BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { Prisma, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    search?: string
    role?: Role
    storeId?: string
    page?: number
    limit?: number
  }) {
    const {
      search,
      role,
      storeId,
      page = 1,
      limit = 10,
    } = params || {}

    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),

      ...(role && { role }),

      ...(storeId && { storeId }),
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.user.count({ where }),
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
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async update(
    id: string,
    data: {
      name?: string
      email?: string
      password?: string
      role?: Role
      storeId?: string | null
      isActive?: boolean
    },
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!existingUser) {
      throw new NotFoundException('User not found')
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      })

      if (emailExists) {
        throw new BadRequestException('Email already exists')
      }
    }

    let hashedPassword: string | undefined

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10)
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(data.name && {
          name: data.name,
        }),

        ...(data.email && {
          email: data.email,
        }),

        ...(hashedPassword && {
          password: hashedPassword,
        }),

        ...(data.role && {
          role: data.role,
        }),

        ...(data.storeId !== undefined && {
          storeId: data.storeId,
        }),

        ...(data.isActive !== undefined && {
          isActive: data.isActive,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    })
  }

  async toggleStatus(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })
  }
}
