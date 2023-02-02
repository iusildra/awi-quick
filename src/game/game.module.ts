import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameZone } from '../zone/entities/game-zone-relation.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Game]),
    SequelizeModule.forFeature([GameZone]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
