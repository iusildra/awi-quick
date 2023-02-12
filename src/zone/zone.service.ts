import { Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from '../entities/zone.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GameZone } from '../entities/game-zone-relation.entity';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone)
    private readonly zoneModel: typeof Zone,
    @InjectModel(GameZone)
    private readonly gameZoneModel: typeof GameZone,
  ) {}

  findAll() {
    return this.zoneModel.findAll();
  }

  findOne(id: number) {
    return this.zoneModel.findOne({ where: { id } });
  }

  create(createZoneDto: CreateZoneDto) {
    return this.zoneModel.create({
      num: 1,
      ...createZoneDto,
    });
  }

  // TODO rework this shit
  async append(id: number, createZoneDto: CreateZoneDto) {
    return this.zoneModel
      .max('num', {
        where: { id },
      })
      .then((lastZone: number) => {
        return this.zoneModel.create({
          id,
          num: lastZone + 1,
          name: createZoneDto.name,
        });
      });
  }

  zipGameWithZone(zoneId: number, gameIds: string[]) {
    return gameIds.map((gameId) => {
      return {
        zoneId,
        gameId,
      };
    });
  }

  async assignGames(zoneId: number, assignGameDto: string[]) {
    const zones = await this.gameZoneModel.bulkCreate(
      this.zipGameWithZone(zoneId, assignGameDto),
    );
    return zones.length;
  }

  unassignGames(zoneId: number, unassignGameDto: string[]) {
    return this.gameZoneModel.destroy({
      where: {
        [Op.or]: this.zipGameWithZone(zoneId, unassignGameDto),
      },
    });
  }

  async update(id: number, updateZoneDto: UpdateZoneDto) {
    return this.zoneModel.update(updateZoneDto, {
      where: { id },
    });
  }

  //TODO: update `num` on remove
  async remove(id: number) {
    return this.zoneModel.destroy({
      where: { id },
    });
  }
}
