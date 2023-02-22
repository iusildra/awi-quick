import { TestingModule, Test } from "@nestjs/testing";
import { VolunteerController } from "./volunteer.controller";
import { VolunteerService } from "./volunteer.service";

describe('VolunteerController', () => {
  let volunteerController: VolunteerController;
  let volunteerService: VolunteerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerController],
      providers: [VolunteerService],
    }).compile();

    volunteerController = module.get<VolunteerController>(VolunteerController);
    volunteerService = module.get<VolunteerService>(VolunteerService);
  });

  describe('create volunteer', () => {
    it('should create a volunteer', async () => {
      const mockVolunteer = { firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com' };
      const result = { id: 1, firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com' };
      jest.spyOn(volunteerService, 'create').mockImplementation(async () => result);

      expect(await volunteerController.create(mockVolunteer)).toEqual(result);
    });
  });

  describe('get volunteers', () => {
    it('should get all volunteers', async () => {
      const result = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com' }];
      jest.spyOn(volunteerService, 'findAll').mockImplementation(async () => result);

      expect(await volunteerController.findAll()).toEqual(result);
    });
  });

  describe('get volunteer by id', () => {
    it('should get a volunteer by id', async () => {
      const result = { id: 1, firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com' };
      jest.spyOn(volunteerService, 'findOne').mockImplementation(async () => result);

      expect(await volunteerController.findOne(1)).toEqual(result);
    });
  });

  describe('update volunteer', () => {
    it('should update a volunteer', async () => {
      const mockVolunteer = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'janedoe@example.com' };
      const result = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'janedoe@example.com' };
      jest.spyOn(volunteerService, 'update').mockImplementation(async () => result);

      expect(await volunteerController.update(1, mockVolunteer)).toEqual(result);
    });
  });

  describe('delete volunteer', () => {
    it('should delete a volunteer', async () => {
      const result = {};
      jest.spyOn(volunteerService, 'delete').mockImplementation(async () => result);

      expect(await volunteerController.delete(1)).toEqual(result
