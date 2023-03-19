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
        select: {
          timeslot: true,
          zone: {
            include: {
              festivals: {
                where: { festival: { active: true } },
                select: { festival: { select: { id: true, name: true } } },
              },
            },
          },
        },
        where: { volunteer_id: id },
      })
      .then((response) =>
        response.reduce(
          (acc, { timeslot, zone }) => ({
            ...acc,
            [zone.id]: {
              name: zone.name,
              festivals: zone.festivals.map((f) => f.festival),
              timeslots: [...(acc[zone.id]?.timeslots || []), timeslot.id],
            },
          }),
          {},
        ),
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
