import { TimeslotController } from './timeslot.controller';
import { TimeslotService } from './timeslot.service';
import { Timeslot } from '../entities/timeslot.entity';

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
});
