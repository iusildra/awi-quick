import { Injectable, Logger } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from './entities/zone.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone)
    private readonly zoneModel: typeof Zone,
  ) {}

  async create(createZoneDto: CreateZoneDto) {
    try {
      Logger.debug({
        num: 1,
        ...createZoneDto,
      });
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
    try {
      const lastZone = Number(
        await this.zoneModel.max('num', {
          where: { id },
        }),
      );
      const zone = await this.zoneModel.create({
        id,
        num: lastZone + 1,
        name: createZoneDto.name,
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findAll() {
    try {
      const zones = await this.zoneModel.findAll();
      return zones;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findZones(id: number) {
    try {
      const zones = await this.zoneModel.findAll({
        where: { id },
      });
      return zones;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findOne(id: number, num: number) {
    try {
      const zone = await this.zoneModel.findOne({
        where: { [Op.and]: [{ id }, { num: num }] },
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }

  async update(id: number, num: number, updateZoneDto: UpdateZoneDto) {
    try {
      const zone = await this.zoneModel.update(updateZoneDto, {
        where: { [Op.and]: [{ id }, { num: num }] },
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }

  async remove(id: number, num: number) {
    try {
      const zone = await this.zoneModel.destroy({
        where: {
          [Op.and]: [{ id }, { num: num }],
        },
      });
      return zone;
    } catch (err) {
      Logger.error(err);
    }
  }
}
