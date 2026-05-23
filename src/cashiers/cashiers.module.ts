import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CashiersController } from './cashiers.controller'
import { CashiersService } from './cashiers.service'

@Module({
  imports: [PrismaModule],
  controllers: [CashiersController],
  providers: [CashiersService],
  exports: [CashiersService],
})
export class CashiersModule {}