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
  UseGuards,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { AssignGameDto } from './dto/assign-game.dto';
import { GameService } from '../game/game.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.gard';
import { CreateRoomDto } from './dto/create-room.dto';

@ApiTags('zone')
@Controller('zone')
export class ZoneController {
  constructor(
    private readonly zoneService: ZoneService,
    private readonly gameService: GameService,
  ) {}

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

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post(':id/append')
  append(
    @Param('id') id: number,
    @Body(new ValidationPipe()) createRoomDto: CreateRoomDto,
  ) {
    return this.zoneService.append(id, createRoomDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post('room/:id/append')
  appendTable(@Param('id') id: number) {
    return this.zoneService.appendTable(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post('table/:id/assign')
  assignGames(
    @Param('id') id: number,
    @Body(new ValidationPipe()) assignGameDto: AssignGameDto,
  ) {
    return this.gameService.findByTable(id).then((games) =>
      this.zoneService.assignGames(
        id,
        assignGameDto.ids.filter(
          (gameId) => !games.some((res) => res.game.id == gameId),
        ),
      ),
    );
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.zoneService.remove(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('table/:id/unassign')
  unassignGames(
    @Param('id') id: number,
    @Body(new ValidationPipe()) assignGameDto: AssignGameDto,
  ) {
    return this.zoneService.unassignGames(id, assignGameDto.ids);
  }
}
