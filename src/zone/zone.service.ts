import { Injectable, Logger } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZoneService {
  constructor(private prisma: PrismaService) {}

  create(createZoneDto: CreateZoneDto) {
    Logger.log(`Creating zone: ${JSON.stringify(createZoneDto)}`);
    return this.prisma.zone.create({ data: createZoneDto });
  }

  findAll() {
    return this.prisma.zone.findMany();
  }

  findUnique(id: number) {
    return this.prisma.zone.findUnique({ where: { id } });
  }

  update(id: number, newZone: UpdateZoneDto) {
    Logger.log(`Updating zone: ${JSON.stringify(newZone)}`);
    return this.prisma.zone.update({
      where: { id },
      data: newZone,
    });
  }

  delete(id: number) {
    Logger.log(`Deleting zone: ${id}`);
    return this.prisma.zone.delete({
      where: { id },
    });
  }
}
