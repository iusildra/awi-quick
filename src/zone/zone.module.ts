import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Zone, GameZone } from '../entities';

@Module({
  imports: [SequelizeModule.forFeature([Zone, GameZone])],
  controllers: [ZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}
