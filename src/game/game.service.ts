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

  create(createGameDto: CreateGameDto) {
    return this.gameModel.create(createGameDto);
  }

  findAll() {
    return this.gameModel.findAll();
  }

  findOne(id: string) {
    return this.gameModel.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.gameModel.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  findByType(type: GameType) {
    return this.gameModel.findAll({
      where: { type },
    });
  }

  async findByZone(id: number) {
    const response = await this.zoneModel.findOne({
      where: { id },
      include: [Game],
    });
    return response.games;
  }

  update(id: string, updateGameDto: UpdateGameDto) {
    return this.gameModel.update(updateGameDto, {
      where: { id },
    });
  }

  remove(id: string) {
    return this.gameModel.destroy({ where: { id } });
  }
}
