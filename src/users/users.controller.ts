import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common'

import { UsersService } from './users.service'

import { Role } from '@prisma/client'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('storeId') storeId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.findAll({
      search,
      role,
      storeId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    })
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(id)
  }
}
