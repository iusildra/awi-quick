import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  AssignVolunteerDto,
  UnassignVolunteerDto,
  UpdateVolunteerDto,
} from './dto';
import { VolunteerService } from './volunteer.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt-auth.gard';
import { Logger } from '@nestjs/common';

@ApiTags('volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  findAll() {
    return this.volunteerService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volunteerService.findFirst(id);
  }

  @Get('zone/:zoneId')
  findWithTimeslotByZone(@Param('zoneId', ParseIntPipe) zoneId: number) {
    return this.volunteerService.findWithTimeslotByZone(zoneId);
  }

  // TODO: maybe add a route to find volunteers by "global" zone

  @Get('timeslot/:timeslotId')
  findWithZoneByTimeslot(
    @Param('timeslotId', ParseIntPipe) timeslotId: number,
  ) {
    return this.volunteerService.findWithZoneByTimeslot(timeslotId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post(':id/assign/:tableId')
  async assign(
    @Param('id') id: string,
    @Param('tableId', ParseIntPipe) tableId: number,
    @Body(new ValidationPipe()) data: AssignVolunteerDto,
  ) {
    Logger.debug(typeof tableId);
    return this.volunteerService
      .getExistingAssignments(id)
      .then((currents) =>
        data.timeslotIds.filter(
          (x) => !currents.some((a) => a.timeslot_id == x),
        ),
      )
      .then((newAssignments) => {
        this.volunteerService.registerAssignments(id, tableId, newAssignments);
      });
  }

  // TODO (PATCH :id) to add/remove admins
  @UseGuards(AdminJwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: UpdateVolunteerDto,
  ) {
    const existingMail = await this.volunteerService.findByMail(data.email);
    if (existingMail) throw new ConflictException('Email already in use');

    const existingUsername = await this.volunteerService.findByUsername(
      data.username,
    );
    if (existingUsername)
      throw new ConflictException('Username already in use');

    return this.volunteerService.update(id, data);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.volunteerService.destroy(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id/unassign/:tableId')
  unassign(
    @Param('id') id: string,
    @Param('tableId', ParseIntPipe) tableId: number,
    @Body(new ValidationPipe()) data: UnassignVolunteerDto,
  ) {
    return this.volunteerService.unregisterAssignments(id, tableId, data);
  }
}
