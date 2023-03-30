import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.gard';

@ApiTags('zone')
@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get()
  findAll() {
    return this.zoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.findUnique(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.delete(id);
  }
}
