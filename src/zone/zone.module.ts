import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { GameModule } from '../game/game.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [GameModule, PrismaModule],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}
