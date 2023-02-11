import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto, GameType } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game, Zone } from '../entities';
import { Op } from 'sequelize';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game)
    private readonly gameModel: typeof Game,
    @InjectModel(Zone)
    private readonly zoneModel: typeof Zone,
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

  async findByName(name: string) {
    try {
      const game = await this.gameModel.findOne({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
      return game;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findByType(type: GameType) {
    try {
      const game = await this.gameModel.findAll({
        where: { type },
      });
      return game;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findByZone(id: number) {
    try {
      const games = await this.zoneModel.findOne({
        where: { id },
        include: [Game],
      });
      return games.games;
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
