import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response, NextFunction } from 'express';
import { VolunteerAssignment } from '../../entities/volunteer-assignment.entity';
import { Timeslot } from '../../entities/timeslot.entity';
import { responses } from '../../responses';

@Injectable()
export class CheckAvailabilityMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(VolunteerAssignment)
    private readonly volunteerAssignmentModel: typeof VolunteerAssignment,
    @InjectModel(Timeslot)
    private readonly timeslotModel: typeof Timeslot,
  ) {}

  getTimeslots(ids: number[]) {
    return this.timeslotModel.findAll({
      where: {
        id: ids,
      },
      order: [
        ['begin', 'ASC'],
        ['end', 'ASC'],
      ],
    });
  }

  // TODO: check if this is correct
  isOverlapping(current: Timeslot, incoming: Timeslot) {
    const different = incoming.id !== current.id;
    const inside =
      (incoming.begin > current.begin && incoming.begin < current.end) ||
      (incoming.end > current.begin && incoming.end < current.end);

    return different && inside;
  }

  async overlaps(currentAssignments: number[], newAssignments: number[]) {
    const currentTimeslots = await this.getTimeslots(currentAssignments);
    const newTimeslots = await this.getTimeslots(newAssignments);

    return newTimeslots.filter((newTimeslot) =>
      currentTimeslots.some((currentTimeslot) =>
        this.isOverlapping(currentTimeslot, newTimeslot),
      ),
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const volunteerId = req.params.id;
    const zoneId = Number(req.params.zoneId);
    const newAssignments = req.body.timeslotIds;

    const currentAssignments = await this.volunteerAssignmentModel
      .findAll({ where: { volunteerId, zoneId } })
      .then((assignments) => assignments.map((a) => a.timeslotId));

    const newAssignmentOverlaps = await this.overlaps(
      newAssignments,
      newAssignments,
    );
    if (newAssignmentOverlaps.length > 0) {
      res.status(400).send({
        [responses.errorMessage]: `Given timeslots overlap with each other`,
        timeslots: newAssignmentOverlaps,
      });
      return;
    }

    const currentAssignmentOverlaps = await this.overlaps(
      currentAssignments,
      newAssignments,
    );
    if (currentAssignmentOverlaps.length > 0) {
      res.status(400).send({
        [responses.errorMessage]: `The new timeslots overlap with the current timeslots.`,
        timeslots: currentAssignmentOverlaps,
      });
      return;
    }

    next();
  }
}
