import { Injectable, Logger } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AddFestivalDay, AddFestivalDayDto } from './dto/add-days.dto';
import { AddFestivalTimeslotsDto } from './dto/add-timeslots.dto';
import { RemoveFestivalDaysDto } from './dto/remove-days.dto';

@Injectable()
export class FestivalService {
  constructor(private prisma: PrismaService) {}

  private daysDtoToModel = (festivalId: string, day: AddFestivalDay) => {
    const date = new Date(day.date);
    const open_at = new Date(day.date);
    const close_at = new Date(day.date);
    const [open_hour, open_minute, open_sec] = day.open_at.split(':');
    const [close_hour, close_minute, close_sec] = day.close_at.split(':');
    open_at.setHours(+open_hour, +open_minute, +open_sec);
    close_at.setHours(+close_hour, +close_minute, +close_sec);
    return {
      festival_id: festivalId,
      date: date,
      open_at: open_at,
      close_at: close_at,
    };
  };

  async create(createFestivalDto: CreateFestivalDto) {
    const { festival_days, ...festival_dto } = createFestivalDto;
    return this.prisma.festival
      .create({
        data: festival_dto,
      })
      .then((festival) =>
        festival_days.map((day) => this.daysDtoToModel(festival.id, day)),
      )
      .then((days) => this.prisma.festival_day.createMany({ data: days }));
  }

  addDays(id: string, festivalDays: AddFestivalDayDto) {
    return this.prisma.festival_day.createMany({
      data: festivalDays.days.map((day) => this.daysDtoToModel(id, day)),
    });
  }

  createTimeslots(id: number, festivalTimeslots: AddFestivalTimeslotsDto) {
    return this.prisma.timeslot.createMany({
      data: festivalTimeslots.timeslots.map((timeslot) => ({
        festival_day_id: id,
        ...timeslot,
      })),
    });
  }

  findAll() {
    return this.prisma.festival.findMany({
      include: { festival_days: true, zones: true },
    });
  }

  findAllActive() {
    return this.prisma.festival.findMany({
      where: { active: true },
    });
  }

  findOne(id: string) {
    return this.prisma.festival.findUnique({ where: { id } });
  }

  findAllTimeslots(id: string) {
    return this.prisma.festival
      .findUnique({
        where: { id },
        include: { festival_days: { include: { timeslots: true } } },
      })
      .then((festival) => festival.festival_days);
  }

  findAllDays(id: string) {
    return this.prisma.festival
      .findUnique({
        where: { id },
        include: { festival_days: true },
      })
      .then((festival) => festival.festival_days);
  }

  findAllZones(id: string) {
    return this.prisma.zone.findMany({ where: { festival_id: id } });
  }

  async findAllAssignments(id: string) {
    const timeslots = await this.prisma.festival_day
      .findMany({
        where: { festival_id: id },
        include: { timeslots: true },
      })
      .then((festival_days) =>
        festival_days.flatMap((festival_day) =>
          festival_day.timeslots.map((ts) => ts.id),
        ),
      );

    return this.prisma.volunteer_assignments
      .groupBy({
        by: ['timeslot_id'],
        where: { timeslot_id: { in: timeslots } },
        _count: {
          timeslot_id: true,
        },
      })
      .then((assignments) =>
        assignments.map((assignment) => ({
          timeslot_id: assignment.timeslot_id,
          nb_volunteers: assignment._count.timeslot_id,
        })),
      );
  }

  update(id: string, updateFestivalDto: UpdateFestivalDto) {
    return this.prisma.festival.update({
      where: { id },
      data: updateFestivalDto,
    });
  }

  activate(id: string) {
    return this.prisma.festival.update({
      where: { id },
      data: { active: true },
    });
  }

  deactivate(id: string) {
    return this.prisma.festival.update({
      where: { id },
      data: { active: false },
    });
  }

  remove(id: string) {
    return this.prisma.festival.delete({ where: { id } });
  }

  removeDays(festivalDays: RemoveFestivalDaysDto) {
    return this.prisma.festival_day.deleteMany({
      where: { id: { in: festivalDays.days } },
    });
  }
}
