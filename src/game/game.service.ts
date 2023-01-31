import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game)
    private readonly gameModel: typeof Game,
  ) {}

  async create(createGameDto: CreateGameDto) {
    try {
      const game = await this.gameModel.create(createGameDto);
      return game;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findAll() {
    try {
      const games = await this.gameModel.findAll();
      return games;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findOne(id: string) {
    try {
      const game = await this.gameModel.findOne({ where: { id } });
      return game;
    } catch (err) {
      Logger.error(err);
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    try {
      const gameUpdated = await this.gameModel.update(updateGameDto, {
        where: { id },
      });
      return gameUpdated;
    } catch (err) {
      Logger.error(err);
    }
  }

  async remove(id: string) {
    try {
      const gameRemoved = await this.gameModel.destroy({ where: { id } });
      return gameRemoved;
    } catch (err) {
      Logger.error(err);
    }
  }
}
