import { Injectable } from '@nestjs/common';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeslotService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.timeslot.findMany();
  }

  findOne(id: number) {
    return this.prisma.timeslot.findFirst({ where: { id } });
  }

  create(createTimeslotDto: CreateTimeslotDto) {
    return this.prisma.timeslot.create({ data: createTimeslotDto });
  }

  update(id: number, updateTimeslotDto: UpdateTimeslotDto) {
    return this.prisma.timeslot.update({
      where: { id },
      data: updateTimeslotDto,
    });
  }

  remove(id: number) {
    return this.prisma.timeslot.delete({ where: { id } });
  }
}
