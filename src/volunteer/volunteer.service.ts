import { IsEmail } from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateVolunteerDto, UnassignVolunteerDto, SignupDto } from './dto';
import { Timeslot, Volunteer, VolunteerAssignment, Zone } from '../entities';
import { Op } from 'sequelize';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectModel(Volunteer)
    private readonly volunteerModel: typeof Volunteer,
    @InjectModel(Zone)
    private readonly zoneModel: typeof Zone,
    @InjectModel(Timeslot)
    private readonly timeslotModel: typeof Timeslot,
    @InjectModel(VolunteerAssignment)
    private readonly volunteerAssignmentModel: typeof VolunteerAssignment,
  ) {}

  // tested
  findAll() {
    return this.volunteerModel.findAll();
  }

  // tested
  findOne(id: string) {
    return this.volunteerModel.findOne({ where: { id } });
  }

  // tested
  findByMailOrUsername(identification: string) {
    return this.volunteerModel.findOne({
      where: {
        [Op.or]: { email: identification, username: identification },
      },
    });
  }

  // tested
  findByMail(email: string) {
    return this.volunteerModel.findOne({ where: { email } });
  }

  // tested
  findByUsername(username: string) {
    return this.volunteerModel.findOne({ where: { username } });
  }

  async findWithTimeslotByZone(id: number) {
    const volunteers = await this.zoneModel.findOne({
      where: { id },
      include: [Volunteer],
    });
    return volunteers.volunteers;
  }

  async findWithZoneByTimeslot(id: number) {
    const volunteers = await this.timeslotModel.findOne({
      where: { id },
      include: [Volunteer],
    });
    return volunteers.volunteers;
  }

  // tested
  create(volunteerDto: SignupDto) {
    return this.volunteerModel.create(volunteerDto);
  }

  // tested
  update(id: string, data: UpdateVolunteerDto) {
    return this.volunteerModel.update(data, {
      where: { id },
    });
  }

  // tested
  destroy(id: string) {
    return this.volunteerModel.destroy({ where: { id } });
  }

  getExistingAssignments(volunteerId: string) {
    return this.volunteerAssignmentModel.findAll({
      where: {
        volunteerId,
      },
    });
  }

  registerAssignments(
    volunteerId: string,
    zoneId: number,
    timeslotIds: number[],
  ) {
    return this.volunteerAssignmentModel.bulkCreate(
      timeslotIds.map((timeslotId) => ({
        volunteerId,
        zoneId,
        timeslotId,
      })),
    );
  }

  unregisterAssignments(
    id: string,
    zoneId: number,
    timeslotIds: UnassignVolunteerDto,
  ) {
    return this.volunteerAssignmentModel.destroy({
      where: {
        volunteerId: id,
        zoneId,
        timeslotId: timeslotIds.timeslotIds,
      },
    });
  }
}
