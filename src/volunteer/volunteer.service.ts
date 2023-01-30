import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateVolunteerDto, UpdateVolunteerDto } from './dto';
import { Volunteer } from './entities/volunteer.entity';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectModel(Volunteer)
    private readonly volunteerModel: typeof Volunteer,
  ) {}

  async findAll() {
    try {
      const volunteers = await this.volunteerModel.findAll();
      return volunteers;
    } catch (err) {
      Logger.error(err);
    }
  }

  async create(volunteerDto: CreateVolunteerDto) {
    Logger.debug(volunteerDto);
    try {
      Logger.debug('tes');
      const volunteer = await this.volunteerModel.create(volunteerDto);
      Logger.debug(volunteer);
      return volunteer;
    } catch (err) {
      Logger.error(err);
    }
  }

  async read(id: string) {
    try {
      const volunteer = await this.volunteerModel.findOne({ where: { id } });
      return volunteer;
    } catch (err) {
      Logger.error(err);
    }
  }

  async update(id: string, data: UpdateVolunteerDto) {
    try {
      const volunteer = await this.volunteerModel.update(data, {
        where: { id },
      });
      return volunteer;
    } catch (err) {
      Logger.error(err);
    }
  }

  async destroy(id: string) {
    try {
      const volunteer = await this.volunteerModel.destroy({ where: { id } });
      return volunteer;
    } catch (err) {
      Logger.error(err);
    }
  }
}
