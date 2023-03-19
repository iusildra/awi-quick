import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { responses } from '../../responses';
import { PrismaService } from '../../prisma/prisma.service';
import { timeslot } from '@prisma/client';

@Injectable()
export class CheckAvailabilityMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  overlaps(currentTimeslots: timeslot[], newTimeslots: timeslot[]) {
    return currentTimeslots.filter((newTimeslot) =>
      newTimeslots.some(
        (currentTimeslot) => currentTimeslot.id !== newTimeslot.id,
      ),
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const volunteerId = req.params.id;
    const zoneId = Number(req.params.zoneId);
    const newTimeslotIds = req.body.timeslotIds;

    const newAssignments = await this.prisma.timeslot.findMany({
      where: { id: { in: newTimeslotIds } },
    });

    const currentAssignments = await this.prisma.volunteer_assignments.findMany(
      {
        where: { volunteer_id: volunteerId, zone_id: zoneId },
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
