import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto, GameType } from './dto';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.gard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('types')
  getTypes() {
    return [
      {
        name: 'Child',
        value: 'child',
      },
      {
        name: 'Family',
        value: 'family',
      },
      {
        name: 'Ambiance',
        value: 'ambiance',
      },
      {
        name: 'Initiate',
        value: 'initiate',
      },
      {
        name: 'Expert',
        value: 'expert',
      },
    ];
  }

  @Get()
  findAll() {
    return this.gameService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findFirst(id);
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
    return this.gameService.findByZone(+zoneId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.update(id, updateGameDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
