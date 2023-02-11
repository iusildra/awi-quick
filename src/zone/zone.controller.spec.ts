import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';
import { Zone, GameZone } from '../entities';
import { NotFoundException } from '@nestjs/common';

const mockZone = {
  id: 1,
  num: 1,
  name: 'zone1',
} as Zone;

describe('ZoneController', () => {
  let controller: ZoneController;
  let service: ZoneService;

  beforeAll(async () => {
    service = new ZoneService(Zone, GameZone);
    controller = new ZoneController(service);
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
});
