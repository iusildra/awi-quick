import { room_table } from './../../node_modules/.prisma/client/index.d';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateVolunteerDto, UnassignVolunteerDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, volunteer, timeslot } from '@prisma/client';

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

  private renameIdToVolunteerId = (volunteer: volunteer) =>
    (({ id, ...rest }) => ({ ...rest, volunteer_id: id }))(volunteer);

  private renameIdToTimeslotId = (timeslot: timeslot) =>
    (({ id, ...rest }) => ({ ...rest, timeslot_id: id }))(timeslot);

  private renameIdToTableId = (table: room_table) =>
    (({ id, ...rest }) => ({ ...rest, table_id: id }))(table);

  // TODO maybe reduced this method ? x))
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
              ...this.renameIdToVolunteerId(volunteer),
              ...this.renameIdToTimeslotId(timeslot),
            })),
          })),
        })),
      );
  }

  async findWithZoneByTimeslot(id: number) {
    const volunteers = await this.prisma.volunteer_assignments
      .findMany({
        where: { timeslot_id: id },
        select: {
          volunteer: true,
          table: {
            include: {
              room: {
                include: {
                  zone: true,
                },
              },
            },
          },
        },
      })
      .then((response) =>
        response.map(({ volunteer, table }) => ({
          ...this.renameIdToVolunteerId(volunteer),
          ...this.renameIdToTableId(table),
        })),
      );
    return volunteers;
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
