import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';
import { Zone, GameZone, Game } from '../entities';
import { NotFoundException } from '@nestjs/common';
import { GameService } from '../game/game.service';

const mockZone = {
  id: 1,
  num: 1,
  name: 'zone1',
} as Zone;

describe('ZoneController', () => {
  let controller: ZoneController;
  let service: ZoneService;
  let gameService: GameService;

  beforeAll(async () => {
    service = new ZoneService(Zone, GameZone);
    gameService = new GameService(Game, Zone);
    controller = new ZoneController(service, gameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should return an array of zones', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([mockZone]));

      const response = await controller.findAll();

      expect(response).toEqual([mockZone]);
    });
  });

  describe('GET /:id', () => {
    it('should return a zone', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(mockZone));

      const response = await controller.findOne(1);

      expect(response).toEqual(mockZone);
    });

    it('should return a 404 error', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      expect(controller.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('POST /', () => {
    it('should create a zone', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(mockZone));

      const response = await controller.create(mockZone);

      expect(response).toEqual(mockZone);
    });
  });

  describe('POST /:id', () => {
    it('should append a zone', async () => {
      jest
        .spyOn(service, 'append')
        .mockImplementation(() => Promise.resolve(mockZone));

      const response = await controller.append(1, mockZone);

      expect(response).toEqual(mockZone);
    });
  });

  describe('POST /:id/assign', () => {
    it('should assign games to a zone', async () => {
      jest
        .spyOn(gameService, 'findByZone')
        .mockImplementation(() => Promise.resolve([]));
      jest
        .spyOn(service, 'assignGames')
        .mockImplementation(() => Promise.resolve(1));

      const response = await controller.assignGames(1, {
        ids: ['4dc19446-b660-4096-9cd9-ecd50083fe8f'],
      });

      expect(response).toEqual(1);
    });

    it('should not assign games to a zone when they are already present', async () => {
      // TODO
    });
  });

  describe('PATCH /:id', () => {
    it('should update a zone', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve([1]));

      const response = await controller.update(1, mockZone);

      expect(response).toEqual([1]);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a zone', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(1));

      const response = await controller.remove(1);

      expect(response).toEqual(1);
    });
  });
});
