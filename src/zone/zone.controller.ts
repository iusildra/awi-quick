import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { AssignGameDto } from './dto/assign-game.dto';

@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get()
  findAll() {
    return this.zoneService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const zone = await this.zoneService.findOne(id);
    if (!zone) throw new NotFoundException('Zone not found');
    return zone;
  }

  @Post()
  create(@Body(new ValidationPipe()) createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  // TODO: not working, to patch
  @Post(':id')
  append(
    @Param('id') id: number,
    @Body(new ValidationPipe()) createZoneDto: CreateZoneDto,
  ) {
    return this.zoneService.append(id, createZoneDto);
  }

  @Post(':id/assign')
  assignGames(
    @Param('id') id: number,
    @Body(new ValidationPipe()) assignGameDto: AssignGameDto,
  ) {
    return this.zoneService.assignGames(id, assignGameDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.zoneService.remove(id);
  }

  @Delete(':id/unassign')
  unassignGames(
    @Param('id') id: number,
    @Body(new ValidationPipe()) assignGameDto: AssignGameDto,
  ) {
    return this.zoneService.unassignGames(id, assignGameDto);
  }
}
