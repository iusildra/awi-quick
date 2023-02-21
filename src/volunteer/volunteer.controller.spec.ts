import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Timeslot, Volunteer, VolunteerAssignment, Zone } from '../entities';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';

const mockVolunteer = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
} as Volunteer;

const mockZone = {
  id: 1,
  num: 1,
  name: 'Zone 1',
} as Zone;

const mockTimeslot = {
  id: 1,
  begin: '2020-01-01 00:00:00',
  end: '2020-01-01 00:00:00',
  name: 'Timeslot 1',
} as unknown as Timeslot;

describe('VolunteerController', () => {
  let volunteerController: VolunteerController;
  let volunteerService: VolunteerService;

  beforeAll(async () => {
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
      jest
        .spyOn(volunteerService, 'findWithTimeslotByZone')
        .mockImplementation(() => Promise.resolve([mockTimeslot]));

      const response = await volunteerController.findWithTimeslotByZone(1);

      expect(response).toStrictEqual([mockVolunteer]);
    });
  });

  describe('GET /timeslot/:timeslotId', () => {
    it('should return every volunteer in the given timeslot', async () => {
      jest
        .spyOn(volunteerService, 'findWithZoneByTimeslot')
        .mockImplementation(() => Promise.resolve([mockZone]));

      const response = await volunteerController.findWithZoneByTimeslot(1);

      expect(response).toStrictEqual([mockVolunteer]);
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
        .mockImplementation(() => Promise.resolve(1));

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

  describe('PUT /:id', () => {
    it('should update a volunteer', async () => {
      jest
        .spyOn(volunteerService, 'findByMail')
        .mockImplementation(() => Promise.resolve(undefined));
      jest
        .spyOn(volunteerService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(undefined));
      jest
        .spyOn(volunteerService, 'update')
        .mockImplementation(() => Promise.resolve([1]));

      const response = await volunteerController.update(
        mockVolunteer.id,
        mockVolunteer,
      );

      expect(response).toStrictEqual([1]);
    });

    it('should throw an error if the volunteer mail already exists', async () => {
      jest
        .spyOn(volunteerService, 'findByMail')
        .mockImplementation(() => Promise.resolve(mockVolunteer));
      jest
        .spyOn(volunteerService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(undefined));

      expect(
        volunteerController.update(mockVolunteer.id, mockVolunteer),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should throw an error if the volunteer username already exists', async () => {
      jest
        .spyOn(volunteerService, 'findByMail')
        .mockImplementation(() => Promise.resolve(undefined));
      jest
        .spyOn(volunteerService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(mockVolunteer));

      expect(
        volunteerController.update(mockVolunteer.id, mockVolunteer),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a volunteer', async () => {
      jest
        .spyOn(volunteerService, 'destroy')
        .mockImplementation(() => Promise.resolve(1));

      const response = await volunteerController.destroy(mockVolunteer.id);

      expect(response).toBe(1);
    });
  });

  describe('DELETE /:id/unassign/:zoneId', () => {
    it('should unassign a volunteer from a zone', async () => {
      const mockAssignment = [
        {
          volunteerId: mockVolunteer.id,
          zoneId: 1,
          timeslotId: 1,
        },
        {
          volunteerId: mockVolunteer.id,
          zoneId: 1,
          timeslotId: 2,
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
