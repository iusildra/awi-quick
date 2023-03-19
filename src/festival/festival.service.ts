import { Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AddFestivalDayDto } from './dto/add-days.dto';
import { AddFestivalTimeslotsDto } from './dto/add-timeslots.dto';
import { RemoveFestivalDaysDto } from './dto/remove-days.dto';

@Injectable()
export class FestivalService {
  constructor(private prisma: PrismaService) {}

  async create(createFestivalDto: CreateFestivalDto) {
    const { festival_days, ...festival_dto } = createFestivalDto;
    const festival = await this.prisma.festival.create({
      data: festival_dto,
    });

    return festival_days.map(
      async (festival_day) =>
        await this.prisma.festival_day.create({
          data: { festival_id: festival.id, ...festival_day },
        }),
    );
  }

  addDays(id: string, festivalDays: AddFestivalDayDto) {
    return festivalDays.days.map(
      async (festivalDay) =>
        await this.prisma.festival_day.create({
          data: { festival_id: id, ...festivalDay },
        }),
    );
  }

  createTimeslots(id: number, festivalTimeslots: AddFestivalTimeslotsDto) {
    return festivalTimeslots.timeslots.map(
      async (festivalTimeslot) =>
        await this.prisma.timeslot.create({
          data: { festival_day_id: id, ...festivalTimeslot },
        }),
    );
  }

  findAll() {
    return this.prisma.festival.findMany();
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
    return this.prisma.festival
      .findUnique({
        where: { id },
        include: { zones: true },
      })
      .then((festival) => festival.zones);
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
