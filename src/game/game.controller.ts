import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto, GameType } from './dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.gameService.findByName(name);
  }

  @Get('type/:type')
  findByType(@Param('type') type: GameType) {
    return this.gameService.findByType(type);
  }

  @Get('zone/:zoneId')
  findByZone(@Param('zoneId') zoneId: number) {
    return this.gameService.findByZone(zoneId);
  }

  @Get('zone/:zoneId/:zoneNumber')
  findByPreciseZone(
    @Param('zoneId') zoneId: number,
    @Param('zoneNumber') zoneNumber: number,
  ) {
    return this.gameService.findByPreciseZone(zoneId, zoneNumber);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
