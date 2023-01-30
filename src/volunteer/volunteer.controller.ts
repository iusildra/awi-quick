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
import { CreateVolunteerDto, UpdateVolunteerDto } from './dto';

@Controller('volunteers')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @Get()
  findAllVolunteer() {
    return this.volunteerService.findAll();
  }

  @Post()
  createVolunteer(@Body() data: CreateVolunteerDto) {
    return this.volunteerService.create(data);
  }

  @Get(':id')
  showVolunteer(@Param('id') id: string) {
    return this.volunteerService.read(id);
  }

  @Put(':id')
  updateVolunteer(@Param('id') id: string, @Body() data: UpdateVolunteerDto) {
    return this.volunteerService.update(id, data);
  }

  @Delete(':id')
  destroyVolunteer(@Param('id') id: string) {
    return this.volunteerService.destroy(id);
  }
}
