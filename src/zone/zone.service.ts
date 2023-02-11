import { Injectable, Logger } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from '../entities/zone.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AssignGameDto } from './dto/assign-game.dto';
import { GameZone } from '../entities/game-zone-relation.entity';
import { UnassignGameDto } from './dto/unassign-game.dto';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone)
    private readonly zoneModel: typeof Zone,
    @InjectModel(GameZone)
    private readonly gameZoneModel: typeof GameZone,
  ) {}

  async create(createZoneDto: CreateZoneDto) {
    try {
      const zone = await this.zoneModel.create({
        num: 1,
        ...createZoneDto,
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }

  async append(id: number, createZoneDto: CreateZoneDto) {
    const lastZone: number = await this.zoneModel.max('num', {
      where: { id },
    });
    return await this.zoneModel.create({
      id,
      num: lastZone + 1,
      name: createZoneDto.name,
    });
  }

  zipGameWithZone(zoneId: number, gameIds: AssignGameDto | UnassignGameDto) {
    return gameIds.ids.map((gameId) => {
      return {
        zoneId,
        gameId,
      };
    });
  }

  async assignGames(zoneId: number, assignGameDto: AssignGameDto) {
    const zones = await this.gameZoneModel.bulkCreate(
      this.zipGameWithZone(zoneId, assignGameDto),
    );
    return zones.length;
  }

  unassignGames(zoneId: number, unassignGameDto: UnassignGameDto) {
    return this.gameZoneModel.destroy({
      where: {
        [Op.or]: this.zipGameWithZone(zoneId, unassignGameDto),
      },
    });
  }

  findAll() {
    return this.zoneModel.findAll();
  }

  findOne(id: number) {
    return this.zoneModel.findOne({ where: { id } });
  }

  async update(id: number, updateZoneDto: UpdateZoneDto) {
    try {
      const zone = await this.zoneModel.update(updateZoneDto, {
        where: { id },
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }

  //TODO: update `num` on remove
  async remove(id: number) {
    try {
      const zone = await this.zoneModel.destroy({
        where: { id },
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }
}
