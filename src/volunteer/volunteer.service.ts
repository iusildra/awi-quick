import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VolunteerDTO } from '../dto/volunteer.dto';
import { VolunteerModel } from '../model/volunteer.model';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectModel(VolunteerModel)
    private readonly volunteerModel: typeof VolunteerModel,
  ) {}

  async findAll() {
    try {
      const volunteers = await this.volunteerModel.findAll();
      return volunteers;
    } catch (err) {
      Logger.error(err);
    }
  }

  async create(volunteerDto: VolunteerDTO) {
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

  async update(id: string, data: VolunteerDTO) {
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
