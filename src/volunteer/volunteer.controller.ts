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
  findAll() {
    return this.volunteerService.findAll();
  }

  @Post()
  create(@Body() data: CreateVolunteerDto) {
    return this.volunteerService.create(data);
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.volunteerService.read(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVolunteerDto) {
    return this.volunteerService.update(id, data);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.volunteerService.destroy(id);
  }
}
