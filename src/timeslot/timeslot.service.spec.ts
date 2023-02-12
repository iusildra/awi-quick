import { Test, TestingModule } from '@nestjs/testing';
import { TimeslotService } from './timeslot.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Game,
  Timeslot,
  VolunteerAssignment,
  Zone,
  Volunteer,
  GameZone,
} from '../entities';

describe('TimeslotService', () => {
  let service: TimeslotService;
  let module: TestingModule;
  const sequelize = SequelizeModule.forRoot({
    dialect: 'postgres',
    storage: ':memory:',
    username: 'postgres',
    password: 'postgres',
    models: [Timeslot, VolunteerAssignment, Zone, Volunteer, GameZone, Game],
    logging: false,
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SequelizeModule.forFeature([Timeslot]), sequelize],
      providers: [TimeslotService],
    }).compile();

    service = module.get<TimeslotService>(TimeslotService);
  });

  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a timeslot', async () => {
    const timeslot = await service.create({
      begin: new Date(),
      end: new Date(),
      name: 'test',
    });
    expect(timeslot).toBeDefined();
  });
});
