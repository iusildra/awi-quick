import { CheckAvailabilityMiddleware } from './check-availability.middleware';
import {
  VolunteerAssignment,
  Timeslot,
  Game,
  GameZone,
  Volunteer,
  Zone,
} from '../../entities';
import { VolunteerService } from '../volunteer.service';
import { Sequelize } from 'sequelize';
import { createMemDB } from '../../utils/createMemDb';

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

describe('CheckAvailabilityMiddleware', () => {
  let volunteerService: VolunteerService;
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

    volunteerService = new VolunteerService(
      Volunteer,
      Zone,
      Timeslot,
      VolunteerAssignment,
    );
  });

  afterEach(async () => {
    await memDb.truncate({ truncate: true, cascade: true });
  });

  afterAll(async () => {
    memDb.close();
  });

  it('should be defined', () => {
    expect(
      new CheckAvailabilityMiddleware(VolunteerAssignment, Timeslot),
    ).toBeDefined();
  });

  it('should register a volunteer for an assignment only if he is not already busy during that time', async () => {
    const volunteer = await volunteerService.create(dummyVolunteer);
    const zone = await Zone.create({
      num: 1,
      name: 'test',
    });
    const timeslots = await Promise.all(
      dummyTimeslots.map((t) => Timeslot.create(t)),
    );

    const ts = await volunteerService.registerAssignments(
      volunteer.id,
      zone.id,
      timeslots.map((t) => t.id),
    );
    expect(ts).toBeDefined();

    const ts2 = await volunteerService.registerAssignments(
      volunteer.id,
      zone.id,
      timeslots.map((t) => t.id),
    );
    expect(ts2).toHaveLength(0);
  });
});
