import { Injectable } from '@nestjs/common';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Timeslot } from '../entities/timeslot.entity';

@Injectable()
export class TimeslotService {
  constructor(
    @InjectModel(Timeslot)
    private readonly timeslotModel: typeof Timeslot,
  ) {}

  findAll() {
    return this.timeslotModel.findAll();
  }

  findOne(id: number) {
    return this.timeslotModel.findOne({
      where: { id },
    });
  }

  create(createTimeslotDto: CreateTimeslotDto) {
    return this.timeslotModel.create(createTimeslotDto);
  }

  update(id: number, updateTimeslotDto: UpdateTimeslotDto) {
    return this.timeslotModel.update(updateTimeslotDto, {
      where: { id },
    });
  }

  remove(id: number) {
    return this.timeslotModel.destroy({
      where: { id },
    });
  }
}
