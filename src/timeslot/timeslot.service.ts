import { Injectable, Logger } from '@nestjs/common';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Timeslot } from './entities/timeslot.entity';
import { Op } from 'sequelize';

@Injectable()
export class TimeslotService {
  constructor(
    @InjectModel(Timeslot)
    private readonly timeslotModel: typeof Timeslot,
  ) {}

  async create(createTimeslotDto: CreateTimeslotDto) {
    try {
      Logger.debug(createTimeslotDto);
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

  async findTimeslots(date: Date) {
    try {
      const timeslots = await this.timeslotModel.findAll({ where: { date } });
      return timeslots;
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(date: Date, begin: string) {
    try {
      const timeslot = await this.timeslotModel.findOne({
        where: { [Op.and]: [{ date }, { begin }] },
      });
      return timeslot;
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    date: Date,
    begin: string,
    updateTimeslotDto: UpdateTimeslotDto,
  ) {
    try {
      const timeslotUpdated = await this.timeslotModel.update(
        updateTimeslotDto,
        {
          where: { [Op.and]: [{ date }, { begin }] },
        },
      );
      return timeslotUpdated;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(date: Date, begin: string) {
    try {
      const timeslotDeleted = await this.timeslotModel.destroy({
        where: { [Op.and]: [{ date }, { begin }] },
      });
      return timeslotDeleted;
    } catch (err) {
      console.log(err);
    }
  }
}
