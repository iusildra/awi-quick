import { room_table } from './../../node_modules/.prisma/client/index.d';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateVolunteerDto, UnassignVolunteerDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, volunteer, timeslot, zone, zone_room } from '@prisma/client';

const selectVolunteer: Prisma.volunteerSelect = {
  id: true,
  username: true,
  email: true,
  isAdmin: true,
};

@Injectable()
export class VolunteerService {
  constructor(private prisma: PrismaService) {}

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
          tables: {
            select: {
              id: true,
              number: true,
              assignments: {
                include: {
                  timeslot: true,
                  volunteer: true,
                },
              },
            },
          },
        },
      })
      .then((response) =>
        response.map(({ tables, ...rest }) => ({
          ...rest,
          tables: tables.map(({ assignments, ...rest }) => ({
            ...rest,
            assignments: assignments.map(({ volunteer, timeslot }) => ({
              ...this.extractInfoFromVolunteer(volunteer),
              ...this.renameIdToTimeslotId(timeslot),
            })),
          })),
        })),
      );
  }

  async findWithZoneByTimeslot(id: number) {
    return this.prisma.zone_room
      .findMany({
        select: {
          id: true,
          name: true,
          tables: {
            select: {
              id: true,
              number: true,
              assignments: {
                where: { timeslot_id: id },
                include: {
                  volunteer: true,
                },
              },
            },
          },
        },
      })
      .then((response) =>
        response.map(({ tables, ...rest }) => ({
          ...rest,
          tables: tables.map(({ assignments, ...rest }) => ({
            ...rest,
            assignments: assignments.map(({ volunteer }) => ({
              ...this.extractInfoFromVolunteer(volunteer),
            })),
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
    return this.prisma.volunteer.update({
      where: { id },
      data,
    });
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
    tableId: number,
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
            table_id: tableId,
            timeslot_id: timeslotId,
          })),
        }),
      )
      .then((assignments) => assignments.count);
  }

  unregisterAssignments(
    id: string,
    tableId: number,
    timeslotIds: UnassignVolunteerDto,
  ) {
    const deleteOptions = timeslotIds.timeslotIds.map((timeslotId) => ({
      volunteer_id: id,
      table_id: tableId,
      timeslot_id: timeslotId,
    }));
    return this.prisma.volunteer_assignments.deleteMany({
      where: { OR: deleteOptions },
    });
  }
}
