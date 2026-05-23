import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common'

import { StockService } from './stock.service'

import { StockInDto } from './dto/stock-in.dto'
import { StockOutDto } from './dto/stock-out.dto'
import { StockAdjustmentDto } from './dto/stock-adjustment.dto'
import { QueryStockDto } from './dto/query-stock.dto'

@Controller('stock')
export class StockController {
  constructor(
    private readonly stockService: StockService,
  ) {}

  @Get('history')
  async history(
    @Query() query: QueryStockDto,
  ) {
    return this.stockService.history(query)
  }

  @Get('low-stock')
  async lowStock(
    @Query('storeId') storeId?: string,
  ) {
    return this.stockService.lowStock(
      storeId,
    )
  }

  @Post('in')
  async stockIn(
    @Body() stockInDto: StockInDto,
  ) {
    return this.stockService.stockIn(
      stockInDto,
    )
  }

  @Post('out')
  async stockOut(
    @Body() stockOutDto: StockOutDto,
  ) {
    return this.stockService.stockOut(
      stockOutDto,
    )
  }

  @Post('adjustment')
  async adjustment(
    @Body()
    stockAdjustmentDto: StockAdjustmentDto,
  ) {
    return this.stockService.adjustment(
      stockAdjustmentDto,
    )
  }
}