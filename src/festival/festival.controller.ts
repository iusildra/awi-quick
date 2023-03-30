import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { AddFestivalDayDto } from './dto/add-days.dto';
import { AddFestivalTimeslotsDto } from './dto/add-timeslots.dto';
import { Logger } from '@nestjs/common';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt-auth.gard';

@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @Post()
  create(@Body(new ValidationPipe()) createFestivalDto: CreateFestivalDto) {
    return this.festivalService.create(createFestivalDto);
  }

  @Post(':id/days')
  addDays(@Param('id') id: string, @Body() festivalDays: AddFestivalDayDto) {
    return this.festivalService.addDays(id, festivalDays);
  }

  @Post('Suppday/:id/timeslots')
  addTimeslots(
    @Param('id', ParseIntPipe) id: number,
    @Body() festivalTimeslots: AddFestivalTimeslotsDto,
  ) {
    return this.festivalService.createTimeslots(id, festivalTimeslots);
  }

  @Get()
  findAll() {
    return this.festivalService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.festivalService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @Get(':id/timeslots')
  findAllTimeslots(@Param('id') id: string) {
    return this.festivalService.findAllTimeslots(id);
  }

  @Get(':id/days')
  findAllDays(@Param('id') id: string) {
    return this.festivalService.findAllDays(id);
  }

  @Get(':id/zones')
  findAllZones(@Param('id') id: string) {
    return this.festivalService.findAllZones(id);
  }

  @Get(':id/assignments/count')
  findAllAssignments(@Param('id') id: string) {
    return this.festivalService.findAllAssignments(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateFestivalDto: UpdateFestivalDto,
  ) {
    return this.festivalService.update(id, updateFestivalDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.festivalService.activate(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.festivalService.deactivate(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    Logger.log(`Deleting festival with id: ${id}`);
    return this.festivalService.remove(id);
  }
}
