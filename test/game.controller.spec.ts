import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game, Zone } from '../entities';
import { GameType } from './dto';

const mockGame = {
  id: '4dc19446-b660-4096-9cd9-ecd50083fe8f',
  name: 'test',
  type: 'child',
} as Game;

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

  describe('GET /', () => {
    it('should return an array of games', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([mockGame]));

      expect(await controller.findAll()).toStrictEqual([mockGame]);
    });
  });

  describe('GET /:id', () => {
    it('should return a game', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(mockGame));

      expect(
        await controller.findOne('4dc19446-b660-4096-9cd9-ecd50083fe8f'),
      ).toStrictEqual(mockGame);
    });
  });

  describe('GET /name/:name', () => {
    it('should return an array of games', async () => {
      jest
        .spyOn(service, 'findByName')
        .mockImplementation(() => Promise.resolve([mockGame]));

      expect(await controller.findByName('test')).toStrictEqual([mockGame]);
    });
  });

  describe('GET /type/:type', () => {
    it('should return an array of games', async () => {
      jest
        .spyOn(service, 'findByType')
        .mockImplementation(() => Promise.resolve([mockGame]));

      expect(await controller.findByType(GameType.CHILD)).toStrictEqual([
        mockGame,
      ]);
    });
  });

  describe('GET /zone/:zoneId', () => {
    it('should return an array of games', async () => {
      jest
        .spyOn(service, 'findByZone')
        .mockImplementation(() => Promise.resolve([mockGame]));

      expect(await controller.findByZone(1)).toStrictEqual([mockGame]);
    });
  });

  describe('POST /', () => {
    it('should create a game', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(mockGame));

      expect(await controller.create(mockGame)).toStrictEqual(mockGame);
    });
  });

  describe('PUT /:id', () => {
    it('should update a game', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve([1]));

      expect(
        await controller.update(
          '4dc19446-b660-4096-9cd9-ecd50083fe8f',
          mockGame,
        ),
      ).toStrictEqual([1]);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a game', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(1));

      expect(
        await controller.remove('4dc19446-b660-4096-9cd9-ecd50083fe8f'),
      ).toStrictEqual(1);
    });
  });
});
