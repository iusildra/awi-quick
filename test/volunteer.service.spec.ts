import { Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import {
  Timeslot,
  Volunteer,
  VolunteerAssignment,
  Zone,
  GameZone,
  Game,
} from '../entities';
import { createMemDB } from '../utils/createMemDb';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { VolunteerService } from './volunteer.service';
import { GameModule } from '../game/game.module';
import { ZoneModule } from '../zone/zone.module';
import { ZoneService } from '../zone/zone.service';

// R.I.P the volunteer service test

describe('VolunteerService', () => {
  let service: VolunteerService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = await createMemDB([
      Timeslot,
      Volunteer,
      VolunteerAssignment,
      Zone,
      GameZone,
      Game,
    ]);

    Logger.debug('Creating service');
    try {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          GameModule,
          ZoneModule,
          SequelizeModule.forFeature([
            Timeslot,
            Volunteer,
            VolunteerAssignment,
            Zone,
            Game,
            GameZone,
          ]),
        ],
        providers: [VolunteerService, ZoneService],
      }).compile();

      service = module.get<VolunteerService>(VolunteerService);
    } catch (e) {
      Logger.error(e);
    }

    Logger.debug('Service created');
    Logger.debug(service);
  });

  afterAll(async () => {
    sequelize.close();
  });

  afterEach(async () => {
    sequelize.truncate();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of volunteers', async () => {
    service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
    });
    service.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@gmail.com',
    });
    service.create({
      firstName: 'Jack',
      lastName: 'Doe',
      email: 'jack.doe@gmail.com',
    });
    const result = await service.findAll();
    expect(result.length).toBe(3);
  });

  it('should create a volunteer then destroy it', async () => {
    const result = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
    });
    expect(result).toBeInstanceOf(CreateVolunteerDto);
    expect(service.destroy(result.id)).resolves.toBe(1);
  });

  it('should create a volunteer then update', async () => {
    const result = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
    });
    expect(result).toBeInstanceOf(CreateVolunteerDto);
    expect(
      service.update(result.id, { ...result, firstName: 'Jane' }),
    ).resolves.toBe(1);
    const updated = await service.findOne(result.id);
    expect(updated.firstName).toBe('Jane');
    expect(service.destroy(result.id)).resolves.toBe(1);
  });
});
