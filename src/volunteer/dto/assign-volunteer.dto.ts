import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

export class AssignVolunteerDto {
  // TODO validate that inputs are numbers GT 0
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Timeslots to assign',
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsArray()
  @Transform(({ value }) => value.map((v: string) => +v))
  timeslotIds: number[];
}
