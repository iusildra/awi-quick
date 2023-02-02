import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Zone } from './entities/zone.entity';
import { GameZone } from './entities/game-zone-relation.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Zone]),
    SequelizeModule.forFeature([GameZone]),
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}
