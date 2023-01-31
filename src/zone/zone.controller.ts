import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Post()
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @Post(':id')
  append(@Param('id') id: number, @Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.append(id, createZoneDto);
  }

  @Get()
  findAll() {
    return this.zoneService.findAll();
  }

  @Get(':id')
  findZones(@Param('id') id: number) {
    return this.zoneService.findZones(id);
  }

  @Get(':id/:zoneNumber')
  findOne(@Param('id') id: number, @Param('zoneNumber') zoneNumber: number) {
    return this.zoneService.findOne(id, zoneNumber);
  }

  @Patch(':id/:zoneNumber')
  update(
    @Param('id') id: number,
    @Param('zoneNumber') zoneNumber: number,
    @Body() updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(id, zoneNumber, updateZoneDto);
  }

  @Delete(':id/:zoneNumber')
  remove(@Param('id') id: number, @Param('zoneNumber') zoneNumber: number) {
    return this.zoneService.remove(id, zoneNumber);
  }
}
