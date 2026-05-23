import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersService } from 'src/users/users.service'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { CreateAdminDto } from './dto/create-admin.dto'
import { VerifyPinDto } from './dto/verify-pin.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account inactive')
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  async generateToken(payload: {
    id: string
    email: string
    role: Role
    storeId?: string | null
  }) {
    const accessToken = await this.jwtService.signAsync(payload)

    return {
      accessToken,
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(
      loginDto.email,
      loginDto.password,
    )

    const token = await this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
      ...token,
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingUser = await this.usersService.findByEmail(
      createAdminDto.email,
    )

    if (existingUser) {
      throw new BadRequestException('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(
      createAdminDto.password,
      10,
    )

    const user = await this.prisma.user.create({
      data: {
        name: createAdminDto.name,
        email: createAdminDto.email,
        password: hashedPassword,
        role: Role.ADMIN_STORE,
        storeId: createAdminDto.storeId,
      },
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
    }
  }

  async verifyCashierPin(verifyPinDto: VerifyPinDto) {
    const cashier = await this.prisma.cashier.findUnique({
      where: {
        id: verifyPinDto.cashierId,
      },
    })

    if (!cashier) {
      throw new UnauthorizedException('Cashier not found')
    }

    if (!cashier.isActive) {
      throw new UnauthorizedException('Cashier inactive')
    }

    if (cashier.pin !== verifyPinDto.pin) {
      throw new UnauthorizedException('Invalid PIN')
    }

    const token = await this.generateToken({
      id: cashier.id,
      email: '',
      role: Role.KASIR,
      storeId: cashier.storeId,
    })

    return {
      cashier: {
        id: cashier.id,
        name: cashier.name,
        storeId: cashier.storeId,
      },
      ...token,
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    )

    if (!isPasswordValid) {
      throw new BadRequestException('Old password incorrect')
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    )

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    })

    return {
      message: 'Password updated successfully',
    }
  }
}