import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto, GameType } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  create(createGameDto: CreateGameDto) {
    return this.prisma.game.create({ data: createGameDto });
  }

  findMany() {
    return this.prisma.game.findMany();
  }

  findFirst(id: string) {
    return this.prisma.game.findFirst({ where: { id } });
  }

  findByName(name: string) {
    return this.prisma.game.findMany({ where: { name: { contains: name } } });
  }

  findByType(type: GameType) {
    return this.prisma.game.findMany({ where: { type } });
  }

  findByZone(zoneId: number) {
    return this.prisma.zone_room
      .findMany({
        where: { zone_id: zoneId },
        include: {
          tables: {
            include: {
              games: { select: { game: true } },
            },
          },
        },
      })
      .then((rooms) =>
        rooms.map(({ id, name, tables }) => ({
          id,
          name,
          tables: tables.map(({ id, number, games }) => ({
            id,
            number,
            games: games.map(({ game }) => game),
          })),
        })),
      );
  }

  async findByTable(tableId: number) {
    const response = await this.prisma.zone_room.findUnique({
      where: { id: tableId },
      select: {
        tables: {
          select: { games: { select: { game: true } } },
        },
      },
    });
    return response.tables.flatMap((table) => table.games);
  }

  update(id: string, updateGameDto: UpdateGameDto) {
    return this.prisma.game.update({
      where: { id },
      data: updateGameDto,
    });
  }

  remove(id: string) {
    return this.prisma.game.delete({ where: { id } });
  }
}
