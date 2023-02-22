import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { VolunteerModelRepository } from '../repository/volunteer.repository';
import { VolunteerModel } from '../model';

describe('VolunteerController', () => {
  let controller: VolunteerController;
  let service: VolunteerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerController],
      providers: [
        VolunteerService,
        {
          provide: VolunteerModelRepository,
          useValue: VolunteerModelRepository,
        },
      ],
    }).compile();

    controller = module.get<VolunteerController>(VolunteerController);
    service = module.get<VolunteerService>(VolunteerService);
  });

  describe('create', () => {
    it('should create a volunteer', async () => {
      const volunteer = new VolunteerModel({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      jest.spyOn(service, 'create').mockResolvedValue(volunteer);

      expect(await controller.createVolunteer(volunteer)).toBe(volunteer);
    });
  });

  describe('findAll', () => {
    it('should return an array of volunteers', async () => {
      const volunteers = [
        new VolunteerModel({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        }),
        new VolunteerModel({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
        }),
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(volunteers);

      expect(await controller.findAllVolunteers()).toBe(volunteers);
    });
  });
});
