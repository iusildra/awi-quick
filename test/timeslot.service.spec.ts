import { TimeslotService } from './timeslot.service';
import {
  Game,
  Timeslot,
  VolunteerAssignment,
  Zone,
  Volunteer,
  GameZone,
} from '../entities';
import { createMemDB } from '../utils/createMemDb';
import { Sequelize } from 'sequelize';

const dummyTimeslot = {
  begin: new Date(),
  end: new Date(),
  name: 'test',
};

describe('TimeslotService', () => {
  let service: TimeslotService;
  let memDb: Sequelize;

  beforeAll(async () => {
    memDb = await createMemDB([
      Timeslot,
      VolunteerAssignment,
      Zone,
      Volunteer,
      GameZone,
      Game,
    ]);

    service = new TimeslotService(Timeslot);
  });

  afterEach(async () => {
    await memDb.truncate({ truncate: true, cascade: true });
  });

  afterAll(async () => {
    memDb.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a timeslot', async () => {
    const timeslot = await service.create(dummyTimeslot);
    expect(timeslot).toBeDefined();
  });

  it('should find all timeslots', async () => {
    const ts = [dummyTimeslot, dummyTimeslot, dummyTimeslot];
    await Promise.all(ts.map((t) => service.create(t)));
    const timeslots = await service.findAll();
    expect(timeslots).toHaveLength(3);
  });

  it('should find a timeslot given an id', async () => {
    const ts = await service.create(dummyTimeslot);
    const timeslot = await service.findOne(ts.id);
    expect(timeslot).toBeDefined();
  });

  it('should update a timeslot', async () => {
    const ts = await service.create(dummyTimeslot);
    const timeslot = await service.update(ts.id, {
      name: 'updated',
    });
    expect(timeslot[0]).toBe(1);
  });

  it('should delete a timeslot', async () => {
    const ts = await service.create(dummyTimeslot);
    const timeslot = await service.remove(ts.id);
    expect(timeslot).toBe(1);
  });
});
