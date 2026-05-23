import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'

import { BarcodesService } from './barcodes.service'

import { CreateBarcodeDto } from './dto/create-barcode.dto'
import { QueryBarcodeDto } from './dto/query-barcode.dto'
import { PrintBarcodeDto } from './dto/print-barcode.dto'

@Controller('barcodes')
export class BarcodesController {
  constructor(
    private readonly barcodesService: BarcodesService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryBarcodeDto,
  ) {
    return this.barcodesService.findAll(query)
  }

  @Get(':barcode')
  async findByBarcode(
    @Param('barcode') barcode: string,
  ) {
    return this.barcodesService.findByBarcode(
      barcode,
    )
  }

  @Post()
  async create(
    @Body()
    createBarcodeDto: CreateBarcodeDto,
  ) {
    return this.barcodesService.create(
      createBarcodeDto,
    )
  }

  @Post('print')
  async print(
    @Body() printBarcodeDto: PrintBarcodeDto,
  ) {
    return this.barcodesService.print(
      printBarcodeDto,
    )
  }
}