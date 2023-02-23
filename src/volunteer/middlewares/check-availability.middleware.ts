import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { responses } from '../../responses';
import { PrismaService } from '../../prisma/prisma.service';
import { timeslot } from '@prisma/client';

@Injectable()
export class CheckAvailabilityMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  // TODO: not correct for timeslot 1 and 5 (see sql file)
  isOverlapping(current: timeslot, incoming: timeslot) {
    Logger.debug(`checking ${current.id} and ${incoming.id}...`);
    const different = incoming.id !== current.id;
    const inside =
      (incoming.start > current.start && incoming.start < current.end) ||
      (incoming.end > current.start && incoming.end < current.end);

    Logger.debug(`different: ${different}, inside: ${inside}`);
    return different && inside;
  }

  overlaps(currentTimeslots: timeslot[], newTimeslots: timeslot[]) {
    return currentTimeslots.filter((newTimeslot) =>
      newTimeslots.some(
        (currentTimeslot) =>
          this.isOverlapping(currentTimeslot, newTimeslot) ||
          this.isOverlapping(newTimeslot, currentTimeslot),
      ),
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const volunteerId = req.params.id;
    const tableId = Number(req.params.tableId);
    const newTimeslotIds = req.body.timeslotIds;

    const newAssignments = await this.prisma.timeslot.findMany({
      where: { id: { in: newTimeslotIds } },
    });

    const currentAssignments = await this.prisma.volunteer_assignments.findMany(
      {
        where: { volunteer_id: volunteerId, table_id: tableId },
        include: { timeslot: true },
      },
    );

    const newAssignmentOverlaps = this.overlaps(newAssignments, newAssignments);
    if (newAssignmentOverlaps.length > 0) {
      res.status(400).send({
        [responses.errorMessage]: `Given timeslots overlap with each other`,
        timeslots: newAssignmentOverlaps,
      });
      return;
    }

    const currentAssignmentOverlaps = this.overlaps(
      currentAssignments.map((x) => x.timeslot),
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
