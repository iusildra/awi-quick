import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import {
  CreateVolunteerDto,
  UpdateVolunteerDto,
  AssignVolunteerDto,
  UnassignVolunteerDto,
} from './dto';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @Get()
  findAll() {
    return this.volunteerService.findAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.volunteerService.read(id);
  }

  @Get('zone/:zoneId/:zoneNumber')
  findWithTimeslotByZone(
    @Param('zoneId') zoneId: number,
    @Param('zoneNumber') zoneNumber: number,
  ) {
    return this.volunteerService.findWithTimeslotByZone(zoneId, zoneNumber);
  }

  // TODO: maybe add a route to find volunteers by "global" zone

  @Get('timeslot/:timeslotId')
  findWithZoneByTimeslot(@Param('timeslotId') timeslotId: number) {
    return this.volunteerService.findWithZoneByTimeslot(timeslotId);
  }

  @Post()
  create(@Body() data: CreateVolunteerDto) {
    return this.volunteerService.create(data);
  }

  @Post(':id/assign/:zoneId/:zoneNumber')
  assign(
    @Param('id') id: string,
    @Param('zoneId') zoneId: number,
    @Param('zoneNumber') zoneNumber: number,
    @Body() data: AssignVolunteerDto,
  ) {
    return this.volunteerService.assign(id, zoneId, zoneNumber, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVolunteerDto) {
    return this.volunteerService.update(id, data);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.volunteerService.destroy(id);
  }

  @Delete(':id/unassign/:zoneId/:zoneNumber')
  unassign(
    @Param('id') id: string,
    @Param('zoneId') zoneId: number,
    @Param('zoneNumber') zoneNumber: number,
    @Body() data: UnassignVolunteerDto,
  ) {
    return this.volunteerService.unassign(id, zoneId, zoneNumber, data);
  }
}
