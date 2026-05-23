import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

import { AuthService } from './auth.service'

import { LoginDto } from './dto/login.dto'
import { CreateAdminDto } from './dto/create-admin.dto'
import { VerifyPinDto } from './dto/verify-pin.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'

import { Roles } from './decorators/roles.decorator'

import { Role } from '@prisma/client'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ) {
    return this.authService.createAdmin(createAdminDto)
  }

  @Post('verify-pin')
  async verifyCashierPin(
    @Body() verifyPinDto: VerifyPinDto,
  ) {
    return this.authService.verifyCashierPin(
      verifyPinDto,
    )
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    )
  }
}