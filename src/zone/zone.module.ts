import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Zone } from './entities/zone.entity';

@Module({
  imports: [SequelizeModule.forFeature([Zone])],
  controllers: [ZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}
