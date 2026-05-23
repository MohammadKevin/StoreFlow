import {
  Controller,
  Get,
  Query,
} from '@nestjs/common'

import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('sales')
  async sales(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.sales(
      storeId,
    )
  }

  @Get('profits')
  async profits(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.profits(
      storeId,
    )
  }

  @Get('products')
  async products(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.products(
      storeId,
    )
  }

  @Get('returns')
  async returns(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.returns(
      storeId,
    )
  }

  @Get('cashiers')
  async cashiers(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.cashiers(
      storeId,
    )
  }

  @Get('purchases')
  async purchases(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.purchases(
      storeId,
    )
  }

  @Get('stocks')
  async stocks(
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.stocks(
      storeId,
    )
  }
}