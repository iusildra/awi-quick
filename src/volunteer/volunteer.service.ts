import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { UpdateVolunteerDto, UnassignVolunteerDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

export const selectVolunteer: Prisma.volunteerSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  isAdmin: true,
};

@Injectable()
export class VolunteerService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  findMany() {
    return this.prisma.volunteer.findMany({ select: selectVolunteer });
  }

  findUnique(id: string) {
    return this.prisma.volunteer.findUnique({
      where: { id },
      select: selectVolunteer,
    });
  }

  findAssignments(id: string) {
    return this.prisma.volunteer_assignments
      .findMany({
        select: { zone: true, timeslot: true },
        where: { volunteer_id: id },
      })
      .then((assignments) =>
        assignments.reduce((acc, a) => {
          const { zone, timeslot } = a;
          const { id, ...rest } = zone;
          acc[id] = {
            ...rest,
            timeslots: [...(acc[id]?.timeslots || []), timeslot],
          };
          return acc;
        }, {}),
      );
  }

  findByMail(email: string) {
    return this.prisma.volunteer.findFirst({ where: { email } });
  }

  findByUsername(username: string) {
    return this.prisma.volunteer.findFirst({ where: { username } });
  }

  create(volunteerDto: SignupDto) {
    Logger.debug(`create: ${JSON.stringify(volunteerDto)}`);
    return this.prisma.volunteer.create({ data: volunteerDto });
  }

  update(id: string, data: UpdateVolunteerDto) {
    return this.prisma.volunteer
      .update({
        where: { id },
        data,
      })
      .then((volunteer) => this.authService.login(volunteer));
  }

  destroy(id: string) {
    return this.prisma.volunteer.delete({ where: { id } });
  }

  getExistingAssignments(volunteerId: string) {
    return this.prisma.volunteer_assignments.findMany({
      where: { volunteer_id: volunteerId },
    });
  }

  registerAssignments(
    volunteerId: string,
    festivalId: string,
    zoneId: number,
    timeslotIds: number[],
  ) {
    return this.getExistingAssignments(volunteerId)
      .then((assignments) => assignments.map((a) => a.timeslot_id))
      .then((existingTimeslotIds) =>
        timeslotIds.filter((x) => !existingTimeslotIds.includes(x)),
      )
      .then((newAssignments) =>
        this.prisma.volunteer_assignments.createMany({
          data: newAssignments.map((timeslotId) => ({
            volunteer_id: volunteerId,
            festival_id: festivalId,
            zone_id: zoneId,
            timeslot_id: timeslotId,
          })),
        }),
      )
      .then((assignments) => assignments.count);
  }

  unregisterAssignments(
    id: string,
    zoneId: number,
    timeslotIds: UnassignVolunteerDto,
  ) {
    const deleteOptions = timeslotIds.timeslotIds.map((timeslotId) => ({
      volunteer_id: id,
      zone_id: zoneId,
      timeslot_id: timeslotId,
    }));
    Logger.debug(deleteOptions);
    return this.prisma.volunteer_assignments.deleteMany({
      where: { OR: deleteOptions },
    });
  }
}
