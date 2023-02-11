import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game, Zone } from '../entities';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  beforeAll(async () => {
    service = new GameService(Game, Zone);
    controller = new GameController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
