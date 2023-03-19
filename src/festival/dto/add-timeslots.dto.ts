import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddFestivalTimeslot {
  @ApiProperty({
    example: '09:00:00',
    type: 'time without time zone',
  })
  start: Date;

  @ApiProperty({
    example: '10:00:00',
    type: 'time without time zone',
  })
  end: Date;
}

export class AddFestivalTimeslotsDto {
  @ApiProperty({
    type: [AddFestivalTimeslot],
  })
  @IsArray()
  timeslots: AddFestivalTimeslot[];
}
