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

  findAllGamesWithRooms() {
    return this.prisma.zone
      .findMany({
        select: {
          id: true,
          name: true,
          rooms: {
            select: {
              id: true,
              name: true,
              game_assignments: {
                select: {
                  game: { select: { id: true, name: true, type: true } },
                },
              },
            },
          },
        },
      })
      .then((zones) =>
        zones.map(({ rooms, ...rest }) => ({
          ...rest,
          rooms: rooms.map(({ game_assignments, ...rest }) => ({
            ...rest,
            game_assignments: game_assignments.map(({ game }) => game),
          })),
        })),
      );
  }

  findByZone(zoneId: number) {
    return this.prisma.zone_room
      .findMany({
        where: { zone_id: zoneId },
        include: {
          game_assignments: { select: { game: true } },
        },
      })
      .then((rooms) =>
        rooms.map(({ id, name, game_assignments }) => ({
          id,
          name,
          game_assignments: game_assignments.map(({ game }) => game),
        })),
      );
  }

  async findByRoom(tableId: number) {
    const response = await this.prisma.zone_room.findUnique({
      where: { id: tableId },
      select: {
        game_assignments: { select: { game: true } },
      },
    });
    return response.game_assignments.map(({ game }) => game);
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
