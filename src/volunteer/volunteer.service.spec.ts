import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerService } from './volunteer.service';
import { VolunteerDTO } from '../dto/volunteer.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Volunteer } from '../model';
import { Sequelize } from 'sequelize';
import { Logger } from '@nestjs/common';

describe('VolunteerService', () => {
  let service: VolunteerService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.TOWER_DB_HOST || 'localhost',
      port: parseInt(process.env.TOWER_DB_PORT) || 5432,
      username: process.env.TOWER_DB_USERNAME || 'postgres',
      password: process.env.TOWER_DB_PASSWORD || 'postgres',
      database: process.env.TOWER_DB_DATABASE || 'postgres',
      logging: process.env.NODE_ENV === 'PRODUCTION' ? false : Logger.debug,
      pool: {
        max: process.env.NODE_ENV === 'PRODUCTION' ? 50 : 2,
        min: process.env.NODE_ENV === 'PRODUCTION' ? 20 : 2,
        idle: 5000,
      },
    });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    sequelize.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteerService,
        {
          provide: getModelToken(Volunteer),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<VolunteerService>(VolunteerService);
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
    expect(result).toBeInstanceOf(VolunteerDTO);
    expect(service.destroy(result.id)).resolves.toBe(1);
  });

  it('should create a volunteer then update', async () => {
    const result = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
    });
    expect(result).toBeInstanceOf(VolunteerDTO);
    expect(
      service.update(result.id, { ...result, firstName: 'Jane' }),
    ).resolves.toBe(1);
    const updated = await service.read(result.id);
    expect(updated.firstName).toBe('Jane');
    expect(service.destroy(result.id)).resolves.toBe(1);
  });
});
