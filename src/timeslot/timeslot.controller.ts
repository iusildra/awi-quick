import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';

@Controller('timeslot')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}

  @Post()
  create(@Body() createTimeslotDto: CreateTimeslotDto) {
    return this.timeslotService.create(createTimeslotDto);
  }

  @Get()
  findAll() {
    return this.timeslotService.findAll();
  }

  @Get(':id/')
  findTimeslots(@Param('id') id: number) {
    return this.timeslotService.findTimeslots(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.timeslotService.findOne(id);
  }

  @Put(':id/')
  update(
    @Param('id') id: number,
    @Body() updateTimeslotDto: UpdateTimeslotDto,
  ) {
    return this.timeslotService.update(id, updateTimeslotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.timeslotService.remove(id);
  }
}
