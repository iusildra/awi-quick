import { IsArray } from 'class-validator';

export class AssignVolunteerDto {
  // TODO validate that inputs are numbers GT 0
  @IsArray()
  timeslotIds: number[];
}
