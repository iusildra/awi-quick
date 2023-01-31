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

  @Get(':date/')
  findTimeslots(@Param('date') id: Date) {
    return this.timeslotService.findTimeslots(id);
  }

  @Get(':date/:begin')
  findOne(@Param('date') date: Date, @Param('begin') begin: string) {
    return this.timeslotService.findOne(date, begin);
  }

  @Put(':date/:begin')
  update(
    @Param('date') date: Date,
    @Param('begin') begin: string,
    @Body() updateTimeslotDto: UpdateTimeslotDto,
  ) {
    return this.timeslotService.update(date, begin, updateTimeslotDto);
  }

  @Delete(':date/:begin')
  remove(@Param('date') date: Date, @Param('begin') begin: string) {
    return this.timeslotService.remove(date, begin);
  }
}
