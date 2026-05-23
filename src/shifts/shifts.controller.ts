import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { ShiftsService } from './shifts.service'

import { OpenShiftDto } from './dto/open-shift.dto'
import { CloseShiftDto } from './dto/close-shift.dto'
import { QueryShiftDto } from './dto/query-shift.dto'

@Controller('shifts')
export class ShiftsController {
  constructor(
    private readonly shiftsService: ShiftsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: QueryShiftDto,
  ) {
    return this.shiftsService.findAll(
      query,
    )
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.shiftsService.findById(id)
  }

  @Post('open')
  async open(
    @Body()
    openShiftDto: OpenShiftDto,
  ) {
    return this.shiftsService.open(
      openShiftDto,
    )
  }

  @Patch(':id/close')
  async close(
    @Param('id') id: string,

    @Body()
    closeShiftDto: CloseShiftDto,
  ) {
    return this.shiftsService.close(
      id,
      closeShiftDto,
    )
  }
}