import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response, NextFunction } from 'express';
import { VolunteerAssignment } from '../entities/volunteer-assignment.entity';
import { Timeslot } from '../../timeslot/entities/timeslot.entity';
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
    const same =
      current.begin === incoming.begin && current.end === incoming.end;
    const currentInsideIncoming =
      current.begin > incoming.begin && current.end < incoming.end;
    const currentLeftOverlapsIncoming =
      current.begin <= incoming.begin && current.end > incoming.begin;
    const currentRightOverlapsIncoming =
      current.begin < incoming.end && current.end >= incoming.end;

    return (
      same ||
      currentInsideIncoming ||
      currentLeftOverlapsIncoming ||
      currentRightOverlapsIncoming
    );
  }

  async hasOverlaps(currentAssignments: number[], newAssignments: number[]) {
    const currentTimeslots = await this.getTimeslots(currentAssignments);
    const newTimeslots = await this.getTimeslots(newAssignments);

    return newTimeslots.some((newTimeslot) =>
      currentTimeslots.some((currentTimeslot) => {
        if (newTimeslot.id === currentTimeslot.id) return false;
        else return this.isOverlapping(currentTimeslot, newTimeslot);
      }),
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const volunteerId = req.params.id;
    const zoneId = Number(req.params.zoneId);
    const zoneNumber = Number(req.params.zoneNumber);
    const newAssignments = req.body.timeslotIds;

    const currentAssignments = await this.volunteerAssignmentModel
      .findAll({ where: { volunteerId, zoneId, zoneNumber } })
      .then((assignments) => assignments.map((a) => a.timeslotId));

    if (await this.hasOverlaps(newAssignments, newAssignments)) {
      res.status(400).send({
        [responses.errorMessage]: 'Given timeslots overlap with each other',
      });
      return;
    }

    if (await this.hasOverlaps(currentAssignments, newAssignments)) {
      res.status(400).send({
        [responses.errorMessage]:
          'The new timeslots overlap with the current timeslots',
      });
      return;
    }

    next();
  }
}
