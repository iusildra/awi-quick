import { VolunteerService } from './volunteer.service';
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
import { CheckAvailabilityMiddleware } from './middlewares/check-availability.middleware';

const dummyVolunteer = {
  username: 'test',
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.test',
  password: 'test',
  isAdmin: false,
} as Volunteer;

const dummyTimeslots = [
  {
    begin: new Date('2023-02-01 10:00:00+00'),
    end: new Date('2023-02-01 12:00:00+00'),
    name: 'test0',
  },
  {
    begin: new Date('2023-02-01 09:00:00+00'),
    end: new Date('2023-02-01 11:00:00+00'),
    name: 'test1',
  },
  {
    begin: new Date('2023-02-01 12:00:00+00'),
    end: new Date('2023-02-01 14:00:00+00'),
    name: 'test2',
  },
];

describe('VolunteerService', () => {
  let service: VolunteerService;
  let middleware: CheckAvailabilityMiddleware;
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

    service = new VolunteerService(
      Volunteer,
      Zone,
      Timeslot,
      VolunteerAssignment,
    );

    middleware = new CheckAvailabilityMiddleware(VolunteerAssignment, Timeslot);
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

  it('should create a volunteer', async () => {
    const volunteer = await service.create(dummyVolunteer);
    expect(volunteer).toBeDefined();
  });

  it('should find all volunteers', async () => {
    await service.create(dummyVolunteer);
    const volunteers = await service.findAll();
    expect(volunteers).toHaveLength(1);
  });

  it('should find a volunteer given an id', async () => {
    const vols = await service.create(dummyVolunteer);
    const volunteer = await service.findOne(vols.id);
    expect(volunteer).toBeDefined();
  });

  it('should find a volunteer given a username or mail', async () => {
    const vols = await service.create(dummyVolunteer);
    const volunteer = await service.findByMailOrUsername(vols.username);
    expect(volunteer).toBeDefined();
    const volunteer2 = await service.findByMailOrUsername(vols.email);
    expect(volunteer2).toBeDefined();
  });

  it('should update a volunteer', async () => {
    const vols = await service.create(dummyVolunteer);
    const volunteer = await service.update(vols.id, {
      username: 'updated',
    });
    expect(volunteer[0]).toBe(1);
  });

  it('should delete a volunteer', async () => {
    const vols = await service.create(dummyVolunteer);
    const volunteer = await service.destroy(vols.id);
    expect(volunteer).toBe(1);
  });

  describe('Assignment Registering', () => {
    it('should register a volunteer for multiple timeslot', async () => {
      const volunteer = await service.create(dummyVolunteer);
      const zone = await Zone.create({
        num: 1,
        name: 'test',
      });
      const timeslots = await Promise.all(
        dummyTimeslots.map((t) => Timeslot.create(t)),
      );
      const ts = await service.registerAssignments(
        volunteer.id,
        zone.id,
        timeslots.map((t) => t.id),
      );
      expect(ts).toHaveLength(3);
    });

    it('should register a volunteer for an assignment only if he is not already busy during that time', async () => {
      const volunteer = await service.create(dummyVolunteer);
      const zone = await Zone.create({
        num: 1,
        name: 'test',
      });
      const timeslots = await Promise.all(
        dummyTimeslots.map((t) => Timeslot.create(t)),
      );

      const ts = await service.registerAssignments(
        volunteer.id,
        zone.id,
        timeslots.filter((t) => t.name != 'test1').map((t) => t.id),
      );
      expect(ts).toHaveLength(2);

      const ts2 = await middleware.overlaps(
        timeslots.filter((t) => t.name != 'test1').map((t) => t.id),
        [timeslots[1].id],
      );
      expect(ts2).toHaveLength(1);
      // Because the length of the array is 1, it means that the middleware has found an overlap, so it will reject the request
    });
  });
});
