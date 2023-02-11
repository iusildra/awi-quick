import { v4 as uuidv4 } from 'uuid';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { Volunteer, Timeslot, VolunteerAssignment, Zone } from '../entities';
import { CreateVolunteerDto } from './dto';

const mockVolunteer = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
} as Volunteer;

describe('VolunteerController', () => {
  let volunteerController: VolunteerController;
  let volunteerService: VolunteerService;

  beforeEach(async () => {
    volunteerService = new VolunteerService(
      Volunteer,
      Zone,
      Timeslot,
      VolunteerAssignment,
    );
    volunteerController = new VolunteerController(volunteerService);
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
      ] as Volunteer[];

      jest
        .spyOn(volunteerService, 'findAll')
        .mockImplementation(() => Promise.resolve(volunteersMock));

      const response = await volunteerController.findAll();

      expect(response).toBe(volunteersMock);
    });
  });

  describe('GET /:id', () => {
    it('should return a volunteer', async () => {
      jest
        .spyOn(volunteerService, 'findOne')
        .mockImplementation(() => Promise.resolve(mockVolunteer));

      const response = await volunteerController.findOne(mockVolunteer.id);

      expect(response).toBe(mockVolunteer);
    });
  });

  describe('GET /zone/:zoneId', () => {
    it('should return every volunteer in the given zone', async () => {
      const mockVolunteer = {
        id: uuidv4(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      } as Volunteer;

      jest
        .spyOn(volunteerService, 'findWithTimeslotByZone')
        .mockImplementation(() => Promise.resolve([mockVolunteer]));

      const response = await volunteerController.findWithTimeslotByZone(1);

      expect(response).toStrictEqual([mockVolunteer]);
    });
  });

  describe('GET /timeslot/:timeslotId', () => {
    it('should return every volunteer in the given timeslot', async () => {
      const mockVolunteer = {
        id: uuidv4(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      } as Volunteer;

      jest
        .spyOn(volunteerService, 'findWithZoneByTimeslot')
        .mockImplementation(() => Promise.resolve([mockVolunteer]));

      const response = await volunteerController.findWithZoneByTimeslot(1);

      expect(response).toStrictEqual([mockVolunteer]);
    });
  });

  describe('POST /', () => {
    it('should create a volunteer', async () => {
      const mockVolunteer = {
        username: 'toto',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      } as Volunteer;

      jest
        .spyOn(volunteerService, 'create')
        .mockImplementation(() => Promise.resolve(mockVolunteer));

      const response = await volunteerController.create(mockVolunteer);

      expect(response).toBe(mockVolunteer);
    });

    // TODO - middleware
    it('should throw an error if the volunteer mail/username already exists', async () => {
      expect(true).toBe(true);
    });
  });

  describe('POST /:id/assign/:zoneId', () => {
    // TODO - maybe add a middleware call instead of controller call
    it('should assign a volunteer to a zone if there are not overlapping in its schedule', async () => {
      const mockAssignment = [
        {
          volunteerId: mockVolunteer.id,
          zoneId: 1,
          timeslotId: 1,
        },
      ] as VolunteerAssignment[];

      jest
        .spyOn(volunteerService, 'getExistingAssignments')
        .mockImplementation(() => Promise.resolve([]));

      jest
        .spyOn(volunteerService, 'registerAssignments')
        .mockImplementation(() => Promise.resolve(mockAssignment));

      const response = await volunteerController.assign(mockVolunteer.id, 1, {
        timeslotIds: mockAssignment.map((a) => a.timeslotId),
      });

      expect(response).toBe(mockAssignment);
    });

    // TODO - middleware
    it('should throw an error if the volunteer is already assigned to a zone at the same time', async () => {
      expect(true).toBe(true);
    });

    // TODO - middleware
    it('should throw an error if incoming timeslots overlap each others', async () => {
      expect(true).toBe(true);
    });
  });

  describe('POST /:id/unassign/:zoneId', () => {
    it('should unassign a volunteer from a zone', async () => {
      const mockAssignment = [
        {
          volunteerId: mockVolunteer.id,
          zoneId: 1,
          timeslotId: 1,
        },
      ] as VolunteerAssignment[];

      jest
        .spyOn(volunteerService, 'unregisterAssignments')
        .mockImplementation(() => Promise.resolve(mockAssignment.length));

      const response = await volunteerController.unassign(mockVolunteer.id, 1, {
        timeslotIds: mockAssignment.map((a) => a.timeslotId),
      });

      expect(response).toBe(mockAssignment.length);
    });
  });
});
