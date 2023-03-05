import { Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class ZoneService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.zone.findMany({
      include: {
        rooms: {
          select: {
            id: true,
            name: true,
            tables: { select: { id: true, number: true } },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.zone.findFirst({
      where: { id },
      select: {
        name: true,
        rooms: {
          select: {
            id: true,
            name: true,
            tables: { select: { id: true, number: true } },
          },
        },
      },
    });
  }

  create(createZoneDto: CreateZoneDto) {
    return this.prisma.zone.create({ data: createZoneDto });
  }

  append(id: number, createRoomDto: CreateRoomDto) {
    return this.prisma.zone_room.create({
      data: {
        zone_id: id,
        ...createRoomDto,
      },
    });
  }

  appendTable(roomId: number) {
    return this.prisma.room_table
      .aggregate({
        _max: {
          number: true,
        },
        where: {
          room_id: roomId,
        },
      })
      .then((result) =>
        this.prisma.room_table.create({
          data: {
            room_id: roomId,
            number: result._max.number + 1,
          },
        }),
      );
  }

  deleteRoom(roomId: number) {
    return this.prisma.zone_room.delete({
      where: {
        id: roomId,
      },
    });
  }

  deleteTable(roomId: number) {
    return this.prisma.room_table.delete({
      where: {
        id: roomId,
      },
    });
  }

  private zipGameWithZone(table_id: number, gameIds: string[]) {
    return gameIds.map((game_id) => {
      return {
        table_id,
        game_id,
      };
    });
  }

  async assignGames(tableId: number, gameIds: string[]) {
    return this.prisma.game_assignment
      .createMany({
        data: this.zipGameWithZone(tableId, gameIds),
      })
      .then((result) => result.count);
  }

  unassignGames(zoneId: number, data: string[]) {
    return this.prisma.game_assignment.deleteMany({
      where: {
        OR: this.zipGameWithZone(zoneId, data),
      },
    });
  }

  async update(id: number, updateZoneDto: UpdateZoneDto) {
    return this.prisma.zone.update({
      where: { id },
      data: updateZoneDto,
    });
  }

  async remove(id: number) {
    return this.prisma.zone.delete({
      where: { id },
    });
  }
}
