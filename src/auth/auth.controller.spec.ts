import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VolunteerService } from '../volunteer/volunteer.service';
import { Zone, Timeslot, Volunteer, VolunteerAssignment } from '../entities';

const mockVolunteer = {
  username: 'toto',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  password: 'password',
} as Volunteer;

describe('AuthController', () => {
  let controller: AuthController;
  let volunteerService: VolunteerService;
  let service: AuthService;

  beforeAll(async () => {
    volunteerService = new VolunteerService(
      Volunteer,
      Zone,
      Timeslot,
      VolunteerAssignment,
    );
    service = new AuthService(volunteerService);
    controller = new AuthController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /signup', () => {
    it('should create a volunteer', async () => {
      jest
        .spyOn(volunteerService, 'create')
        .mockImplementation(() => Promise.resolve(mockVolunteer));

      jest
        .spyOn(volunteerService, 'findByMail')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(volunteerService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(null));

      const response = await controller.signup(mockVolunteer);

      expect(response).toBe(mockVolunteer);
    });

    // TODO - middleware
    it('should throw an error if the volunteer mail/username already exists', async () => {
      expect(true).toBe(true);
    });
  });

  describe('POST /login', () => {
    it('should return a token', async () => {
      // TODO
    });

    it('should throw an error if the volunteer does not exist', async () => {
      // TODO
    });

    it('should throw an error if the password is incorrect', async () => {
      // TODO
    });
  });
});
