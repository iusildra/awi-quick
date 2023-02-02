import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Volunteer } from './entities/volunteer.entity';
import * as request from 'supertest';
import { INestApplication, Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

// desesperate attempt to get the test to work

describe('VolunteerController', () => {
  let volunteerController: VolunteerController;
  let volunteerService: VolunteerService;
  let sequelize: Sequelize;
  let app: INestApplication;

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
    sequelize.addModels([Volunteer]);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forFeature([Volunteer])],
      controllers: [VolunteerController],
      providers: [
        VolunteerService,
        {
          provide: getRepositoryToken(Volunteer),
          useClass: Repository,
        },
      ],
    }).compile();

    volunteerController = module.get<VolunteerController>(VolunteerController);
    volunteerService = module.get<VolunteerService>(VolunteerService);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(volunteerController).toBeDefined();
  });

  describe('GET /', () => {
    it('should return every volunteers', async () => {
      const volunteersMock = [
        {
          id: uuidv4(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
        },
        {
          id: uuidv4(),
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'janedoe@example.com',
        },
        {
          id: uuidv4(),
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bobsmith@example.com',
        },
        {
          id: uuidv4(),
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alicejohnson@example.com',
        },
      ].map((volunteer) => Volunteer.build(volunteer));

      jest
        .spyOn(volunteerService, 'findAll')
        .mockImplementation(() => Promise.resolve(volunteersMock));

      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(volunteersMock);
    });
  });
});
