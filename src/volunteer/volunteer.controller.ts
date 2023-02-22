import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
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
  findWithTimeslotByZone(@Param('zoneId') zoneId: number) {
    return this.volunteerService.findWithTimeslotByZone(+zoneId);
  }

  // TODO: maybe add a route to find volunteers by "global" zone

  @Get('timeslot/:timeslotId')
  findWithZoneByTimeslot(@Param('timeslotId') timeslotId: number) {
    return this.volunteerService.findWithZoneByTimeslot(+timeslotId);
  }

  // @UseGuards(AdminJwtAuthGuard)
  // @Post()
  // create(@Body(new ValidationPipe()) data: SignupDto) {
  //   return this.volunteerService.create(data);
  // }

  @UseGuards(AdminJwtAuthGuard)
  @Post(':id/assign/:tableId')
  async assign(
    @Param('id') id: string,
    @Param('tableId') tableId: number,
    @Body(new ValidationPipe()) data: AssignVolunteerDto,
  ) {
    const currentAssignments = this.volunteerService.getExistingAssignments(id);

    const newAssignments = await Promise.all(
      data.timeslotIds.filter(
        async (x) =>
          !(await currentAssignments).map((a) => a.timeslot_id).includes(x),
      ),
    );
    return this.volunteerService.registerAssignments(
      id,
      tableId,
      newAssignments,
    );
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
    @Param('tableId') tableId: number,
    @Body(new ValidationPipe()) data: UnassignVolunteerDto,
  ) {
    return this.volunteerService.unregisterAssignments(id, tableId, data);
  }
}
