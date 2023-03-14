import { Injectable, Logger } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { zone } from '@prisma/client';
import { RoomUpdate, UpdateZoneDto } from './dto/update-zone.dto';

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

  findAllRooms() {
    return this.prisma.zone_room.findMany({
      include: {
        tables: true,
        zone: { select: { name: true } },
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
      include: {
        tables: true,
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

  zipGameWithZone(room_id: number, gameIds: string[]) {
    return gameIds.map((game_id) => ({
      room_id,
      game_id,
    }));
  }

  assignGames(roomId: number, gameIds: string[]) {
    return this.prisma.game_assignment
      .createMany({
        data: this.zipGameWithZone(roomId, gameIds),
      })
      .then((result) => result.count);
  }

  unassignGames(roomId: number, data: string[]) {
    return this.prisma.game_assignment.deleteMany({
      where: {
        OR: this.zipGameWithZone(roomId, data),
      },
    });
  }

  updateZones(newZones: zone[]) {
    return Promise.all(
      newZones.map(async (zone) => {
        return await this.prisma.zone.update({
          where: { id: zone.id },
          data: {
            name: zone.name,
          },
        });
      }),
    );
  }

  private changeRoomName(roomId: number, name: string) {
    return this.prisma.zone_room.update({
      where: { id: roomId },
      data: { name },
    });
  }

  private getCurrentTableCount(roomId: number) {
    return this.prisma.room_table
      .aggregate({
        _max: {
          number: true,
        },
        where: {
          room_id: roomId,
        },
      })
      .then((result) => result._max.number);
  }

  private removeTables(roomId: number, count: number) {
    Logger.log(`Removing ${count} tables from room ${roomId}`);
    return this.prisma.room_table.deleteMany({
      where: {
        room_id: roomId,
        number: { gt: count },
      },
    });
  }

  private async addTables(roomId: number, start: number, count: number) {
    Logger.log(`Adding ${count} tables to room ${roomId}`);
    return this.prisma.room_table.createMany({
      data: Array.from({ length: count }, (_, i) => ({
        room_id: roomId,
        number: start + i,
      })),
    });
  }

  private async updateTables(newRoom: RoomUpdate) {
    const nbTables = await this.getCurrentTableCount(newRoom.id);

    Logger.log(`Current table count for room ${newRoom.id}: ${nbTables}`);
    Logger.log(`Count to reach : ${newRoom.tableCount}`);
    if (newRoom.tableCount == nbTables) return;
    if (newRoom.tableCount < nbTables)
      return await this.removeTables(newRoom.id, newRoom.tableCount);

    return await this.addTables(
      newRoom.id,
      nbTables + 1,
      newRoom.tableCount - nbTables,
    );
  }

  updateRooms(newRooms: typeof UpdateZoneDto.prototype.roomUpdates) {
    const updatedNames = newRooms
      .filter((room) => room.name != undefined)
      .flatMap(async (room) => await this.changeRoomName(room.id, room.name));
    const updatedTables = newRooms
      .filter((room) => room.tableCount != undefined)
      .flatMap(async (room) => await this.updateTables(room));

    return Promise.all([...updatedNames, ...updatedTables]);
  }

  remove(id: number) {
    return this.prisma.zone.delete({
      where: { id },
    });
  }

  removeRoom(id: number) {
    return this.prisma.zone_room.delete({
      where: { id },
    });
  }

  removeTable(id: number) {
    return this.prisma.room_table.delete({
      where: { id },
    });
  }
}
