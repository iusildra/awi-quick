import { room_table } from './../../node_modules/.prisma/client/index.d';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { UpdateVolunteerDto, UnassignVolunteerDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, volunteer, timeslot, zone, zone_room } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

const selectVolunteer: Prisma.volunteerSelect = {
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

  // tested
  findMany() {
    return this.prisma.volunteer.findMany({ select: selectVolunteer });
  }

  // tested
  findFirst(id: string) {
    return this.prisma.volunteer.findFirst({
      where: { id },
      select: selectVolunteer,
    });
  }

  // tested
  findByMail(email: string) {
    return this.prisma.volunteer.findFirst({ where: { email } });
  }

  // tested
  findByUsername(username: string) {
    return this.prisma.volunteer.findFirst({ where: { username } });
  }

  private extractInfoFromVolunteer = (volunteer: volunteer) => ({
    volunteer_id: volunteer.id,
    username: volunteer.username,
    email: volunteer.email,
    isAdmin: volunteer.isAdmin,
  });

  private renameIdToTimeslotId = (timeslot: timeslot) =>
    (({ id, ...rest }) => ({ ...rest, timeslot_id: id }))(timeslot);

  private extractInfoFromTable = (
    table: room_table & { room: zone_room & { zone: zone } },
  ) => ({
    table_id: table.id,
    room_id: table.room_id,
    room_name: table.room.name,
    zone_id: table.room.zone_id,
    zone_name: table.room.zone.name,
  });

  // TODO maybe reduced this method ? x))
  // TODO and extract a common method with the following one
  async findWithTimeslotByZone(id: number) {
    return this.prisma.zone_room
      .findMany({
        where: { zone_id: id },
        select: {
          id: true,
          name: true,
          volunteer_assignments: {
            include: {
              timeslot: true,
              volunteer: true,
            },
          },
        },
      })
      .then((response) =>
        response.map(({ volunteer_assignments, ...rest }) => ({
          ...rest,
          volunteer_assignments: volunteer_assignments.map(
            ({ volunteer, timeslot }) => ({
              ...this.extractInfoFromVolunteer(volunteer),
              ...this.renameIdToTimeslotId(timeslot),
            }),
          ),
        })),
      );
  }

  async findWithZoneByTimeslot(id: number) {
    return this.prisma.zone_room
      .findMany({
        select: {
          id: true,
          name: true,
          volunteer_assignments: {
            where: { timeslot_id: id },
            include: {
              volunteer: true,
            },
          },
        },
      })
      .then((response) =>
        response.map(({ volunteer_assignments, ...rest }) => ({
          ...rest,
          volunteer_assignments: volunteer_assignments.map(({ volunteer }) => ({
            ...this.extractInfoFromVolunteer(volunteer),
          })),
        })),
      );
  }

  // tested
  create(volunteerDto: SignupDto) {
    Logger.debug(`create: ${JSON.stringify(volunteerDto)}`);
    return this.prisma.volunteer.create({ data: volunteerDto });
  }

  // tested
  update(id: string, data: UpdateVolunteerDto) {
    return this.prisma.volunteer
      .update({
        where: { id },
        data,
      })
      .then((volunteer) => this.authService.login(volunteer));
  }

  // tested
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
    roomId: number,
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
            room_id: roomId,
            timeslot_id: timeslotId,
          })),
        }),
      )
      .then((assignments) => assignments.count);
  }

  unregisterAssignments(
    id: string,
    roomId: number,
    timeslotIds: UnassignVolunteerDto,
  ) {
    const deleteOptions = timeslotIds.timeslotIds.map((timeslotId) => ({
      volunteer_id: id,
      room_id: roomId,
      timeslot_id: timeslotId,
    }));
    return this.prisma.volunteer_assignments.deleteMany({
      where: { OR: deleteOptions },
    });
  }
}
