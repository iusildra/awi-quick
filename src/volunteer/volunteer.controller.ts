import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';

import {
  AssignVolunteerDto,
  SignupDto,
  UnassignVolunteerDto,
  UpdateVolunteerDto,
} from './dto';
import { VolunteerService } from './volunteer.service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @Get()
  findAll() {
    return this.volunteerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volunteerService.findOne(id);
  }

  @Get('zone/:zoneId')
  findWithTimeslotByZone(@Param('zoneId') zoneId: number) {
    return this.volunteerService.findWithTimeslotByZone(zoneId);
  }

  // TODO: maybe add a route to find volunteers by "global" zone

  @Get('timeslot/:timeslotId')
  findWithZoneByTimeslot(@Param('timeslotId') timeslotId: number) {
    return this.volunteerService.findWithZoneByTimeslot(timeslotId);
  }

  @Post()
  create(@Body(new ValidationPipe()) data: SignupDto) {
    return this.volunteerService.create(data);
  }

  @Post(':id/assign/:zoneId')
  assign(
    @Param('id') id: string,
    @Param('zoneId') zoneId: number,
    @Body(new ValidationPipe()) data: AssignVolunteerDto,
  ) {
    const currentAssignments = this.volunteerService.getExistingAssignments(id);

    const newAssignments = data.timeslotIds
      .filter(
        async (x) =>
          !(await currentAssignments).map((a) => a.timeslotId).includes(x),
      )
      .map((timeslotId) => ({
        volunteerId: id,
        zoneId,
        timeslotId,
      }));

    return this.volunteerService.registerAssignments(newAssignments);
  }

  // TODO (PATCH :id) to add/remove admins

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

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.volunteerService.destroy(id);
  }

  @Delete(':id/unassign/:zoneId')
  unassign(
    @Param('id') id: string,
    @Param('zoneId') zoneId: number,
    @Body(new ValidationPipe()) data: UnassignVolunteerDto,
  ) {
    return this.volunteerService.unregisterAssignments(id, zoneId, data);
  }
}
