import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('timeslot')
@Controller('timeslot')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}

  @Get()
  findAll() {
    return this.timeslotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.timeslotService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createTimeslotDto: CreateTimeslotDto) {
    return this.timeslotService.create(createTimeslotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateTimeslotDto: UpdateTimeslotDto,
  ) {
    return this.timeslotService.update(id, updateTimeslotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.timeslotService.remove(id);
  }
}
