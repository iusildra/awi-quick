import { TimeslotController } from './timeslot.controller';
import { TimeslotService } from './timeslot.service';
import { Timeslot } from '../entities/timeslot.entity';

const mockTimeslot = {
  id: 1,
  begin: new Date(),
  end: new Date(),
  name: 'test',
} as Timeslot;

describe('TimeslotController', () => {
  let controller: TimeslotController;
  let service: TimeslotService;

  beforeAll(async () => {
    service = new TimeslotService(Timeslot);
    controller = new TimeslotController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should return an array of timeslots', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([mockTimeslot]));

      expect(await controller.findAll()).toStrictEqual([mockTimeslot]);
    });
  });

  describe('GET /:id', () => {
    it('should return a timeslot', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(mockTimeslot));

      expect(await controller.findOne(1)).toStrictEqual(mockTimeslot);
    });
  });

  describe('POST /', () => {
    it('should create a timeslot', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(mockTimeslot));

      expect(await controller.create(mockTimeslot)).toStrictEqual(mockTimeslot);
    });
  });

  describe('PUT /:id', () => {
    it('should update a timeslot', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve([1]));

      expect(await controller.update(1, mockTimeslot)).toStrictEqual([1]);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a timeslot', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(1));

      expect(await controller.remove(1)).toStrictEqual(1);
    });
  });
});
