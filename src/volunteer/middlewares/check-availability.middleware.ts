import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { responses } from '../../responses';
import { PrismaService } from '../../prisma/prisma.service';
import { timeslot } from '@prisma/client';

@Injectable()
export class CheckAvailabilityMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  getTimeslots(ids: number[]) {
    return this.prisma.timeslot.findMany({
      where: {
        AND: ids.map((id) => ({ id })),
      },
      orderBy: {
        start: 'asc',
        end: 'asc',
      },
    });
  }

  // TODO: check if this is correct
  isOverlapping(current: timeslot, incoming: timeslot) {
    const different = incoming.id !== current.id;
    const inside =
      (incoming.start > current.start && incoming.start < current.end) ||
      (incoming.end > current.start && incoming.end < current.end);

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
    const tableId = Number(req.params.tableId);
    const newAssignments = req.body.timeslotIds;

    const currentAssignments = await this.prisma.volunteer_assignments
      .findMany({ where: { volunteer_id: volunteerId, table_id: tableId } })
      .then((assignments) => assignments.map((a) => a.timeslot_id));

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
