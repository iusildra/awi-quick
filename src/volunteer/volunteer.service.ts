import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateVolunteerDto,
  UpdateVolunteerDto,
  AssignVolunteerDto,
  UnassignVolunteerDto,
} from './dto';
import { Volunteer, VolunteerAssignment } from './entities';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectModel(Volunteer)
    private readonly volunteerModel: typeof Volunteer,
    @InjectModel(VolunteerAssignment)
    private readonly volunteerAssignmentModel: typeof VolunteerAssignment,
  ) {}

  async findAll() {
    try {
      const volunteers = await this.volunteerModel.findAll();
      return volunteers;
    } catch (err) {
      Logger.error(err);
    }
  }

  async findWithTimeslotByZone(zoneId: number, zoneNumber: number) {
    try {
      const volunteers = await this.volunteerAssignmentModel.findAll({
        where: {
          zoneId,
          zoneNumber,
        },
      });
      return volunteers.map((v) => v.volunteerId);
    } catch (err) {
      Logger.error(err);
    }
  }

  async findWithZoneByTimeslot(timeslotId: number) {
    try {
      const volunteers = await this.volunteerAssignmentModel.findAll({
        where: {
          timeslotId,
        },
      });
      return volunteers.map((v) => v.volunteerId);
    } catch (err) {
      Logger.error(err);
    }
  }

  async create(volunteerDto: CreateVolunteerDto) {
    Logger.debug(volunteerDto);
    try {
      const volunteer = await this.volunteerModel.create(volunteerDto);
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

  async assign(
    id: string,
    zoneId: number,
    zoneNumber: number,
    timeslotIds: AssignVolunteerDto,
  ) {
    try {
      const currentAssignments = await this.volunteerAssignmentModel.findAll({
        where: {
          volunteerId: id,
          zoneId,
          zoneNumber,
        },
      });

      const assignmentAdded = await this.volunteerAssignmentModel.bulkCreate(
        timeslotIds.timeslotIds
          .filter(
            (x) => !currentAssignments.map((a) => a.timeslotId).includes(x),
          )
          .map((timeslotId) => ({
            volunteerId: id,
            zoneId,
            zoneNumber,
            timeslotId,
          })),
      );
      return assignmentAdded.length;
    } catch (err) {
      Logger.error(err);
    }
  }

  async unassign(
    id: string,
    zoneId: number,
    zoneNumber: number,
    timeslotIds: UnassignVolunteerDto,
  ) {
    try {
      const assignmentRemoved = await this.volunteerAssignmentModel.destroy({
        where: {
          volunteerId: id,
          zoneId,
          zoneNumber,
          timeslotId: timeslotIds.timeslotIds,
        },
      });
      return assignmentRemoved;
    } catch (err) {
      Logger.error(err);
    }
  }
}
