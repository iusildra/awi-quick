import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto, GameType } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { Op } from 'sequelize';
import { GameZone } from '../zone/entities/game-zone-relation.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game)
    private readonly gameModel: typeof Game,
    @InjectModel(GameZone)
    private readonly gameZoneModel: typeof GameZone,
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

  extractGames(gameZones: GameZone[]) {
    const ids = gameZones.map((gameZone) => gameZone.gameId);
    return this.gameModel.findAll({ where: { id: ids } });
  }

  // TODO: use joins instead
  async findByZone(zoneId: number) {
    try {
      const games = await this.gameZoneModel
        .findAll({ where: { zoneId } })
        .then((gameZones) => this.extractGames(gameZones));
      return games;
    } catch (err) {
      Logger.error(err);
    }
  }

  // TODO: use joins instead
  async findByPreciseZone(zoneId: number, zoneNumber: number) {
    try {
      const games = await this.gameZoneModel
        .findAll({ where: { zoneId, zoneNumber } })
        .then((gameZones) => this.extractGames(gameZones));
      return games;
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
