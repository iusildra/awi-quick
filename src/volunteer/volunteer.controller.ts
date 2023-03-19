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
    return this.volunteerService.findUnique(id);
  }

  @Get(':id/assignments')
  findAssignments(@Param('id') id: string) {
    return this.volunteerService.findAssignments(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post(':id/assign/:roomId')
  async assign(
    @Param('id') id: string,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body(new ValidationPipe()) data: AssignVolunteerDto,
  ) {
    return this.volunteerService
      .getExistingAssignments(id)
      .then((currents) =>
        data.timeslotIds.filter(
          (x) => !currents.some((a) => a.timeslot_id == x),
        ),
      )
      .then((newAssignments) =>
        this.volunteerService.registerAssignments(id, roomId, newAssignments),
      );
  }

  // TODO (PATCH :id) to add/remove admins
  @UseGuards(AdminJwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: UpdateVolunteerDto,
  ) {
    if (data.email) {
      const existing = await this.volunteerService.findByMail(data.email);
      if (existing) throw new ConflictException('Email already in use');
    }

    if (data.username) {
      const existing = await this.volunteerService.findByUsername(
        data.username,
      );
      if (existing) throw new ConflictException('Username already in use');
    }

    return this.volunteerService.update(id, data);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.volunteerService.destroy(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id/unassign/:roomId')
  unassign(
    @Param('id') id: string,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body(new ValidationPipe()) data: UnassignVolunteerDto,
  ) {
    return this.volunteerService.unregisterAssignments(id, roomId, data);
  }
}
