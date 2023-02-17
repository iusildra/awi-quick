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
import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { ApiTags } from '@nestjs/swagger';

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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  // TODO: not working, to patch
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  append(
    @Param('id') id: number,
    @Body(new ValidationPipe()) createZoneDto: CreateZoneDto,
  ) {
    return this.zoneService.append(id, createZoneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/assign')
  assignGames(
    @Param('id') id: number,
    @Body(new ValidationPipe()) assignGameDto: AssignGameDto,
  ) {
    return this.gameService.findByZone(id).then((games) => {
      return this.zoneService.assignGames(
        id,
        assignGameDto.ids.filter(
          (gameId) => !games.map((x) => x.id).includes(gameId),
        ),
      );
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.zoneService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unassign')
  unassignGames(
    @Param('id') id: number,
    @Body(new ValidationPipe()) assignGameDto: AssignGameDto,
  ) {
    return this.zoneService.unassignGames(id, assignGameDto.ids);
  }
}
