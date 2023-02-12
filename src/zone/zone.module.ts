import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Zone, GameZone } from '../entities';
import { GameModule } from '../game/game.module';

@Module({
  imports: [GameModule, SequelizeModule.forFeature([Zone, GameZone])],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}
