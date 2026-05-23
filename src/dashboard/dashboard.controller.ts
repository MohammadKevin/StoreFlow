import {
  Controller,
  Get,
  Query,
} from '@nestjs/common'

import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('summary')
  async summary(
    @Query('storeId') storeId?: string,
  ) {
    return this.dashboardService.summary(
      storeId,
    )
  }

  @Get('sales-chart')
  async salesChart(
    @Query('storeId') storeId?: string,
  ) {
    return this.dashboardService.salesChart(
      storeId,
    )
  }

  @Get('top-products')
  async topProducts(
    @Query('storeId') storeId?: string,
  ) {
    return this.dashboardService.topProducts(
      storeId,
    )
  }

  @Get('top-cashiers')
  async topCashiers(
    @Query('storeId') storeId?: string,
  ) {
    return this.dashboardService.topCashiers(
      storeId,
    )
  }

  @Get('recent-sales')
  async recentSales(
    @Query('storeId') storeId?: string,
  ) {
    return this.dashboardService.recentSales(
      storeId,
    )
  }

  @Get('low-stock')
  async lowStock(
    @Query('storeId') storeId?: string,
  ) {
    return this.dashboardService.lowStock(
      storeId,
    )
  }
}