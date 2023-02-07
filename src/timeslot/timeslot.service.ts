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

  async create(createTimeslotDto: CreateTimeslotDto) {
    try {
      const timeslot = await this.timeslotModel.create(createTimeslotDto);
      return timeslot;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      const timeslots = await this.timeslotModel.findAll();
      return timeslots;
    } catch (err) {
      console.log(err);
    }
  }

  async findTimeslots(id: number) {
    try {
      const timeslots = await this.timeslotModel.findAll({ where: { id } });
      return timeslots;
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: number) {
    try {
      const timeslot = await this.timeslotModel.findOne({
        where: { id },
      });
      return timeslot;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, updateTimeslotDto: UpdateTimeslotDto) {
    try {
      const timeslotUpdated = await this.timeslotModel.update(
        updateTimeslotDto,
        {
          where: { id },
        },
      );
      return timeslotUpdated;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number) {
    try {
      const timeslotDeleted = await this.timeslotModel.destroy({
        where: { id },
      });
      return timeslotDeleted;
    } catch (err) {
      console.log(err);
    }
  }
}
