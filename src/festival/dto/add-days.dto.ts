import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class AddFestivalDay {
  @ApiProperty({
    example: '2020-01-01 09:00:00',
    description: 'The begin date',
    type: 'timestamp without time zone',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    example: '10:00:00',
    description: 'The opening time',
    type: 'time without time zone',
  })
  @IsDate()
  open_at: string;

  @ApiProperty({
    example: '23:00:00',
    description: 'The closing time',
    type: 'time without time zone',
  })
  @IsDate()
  close_at: string;
}

export class AddFestivalDayDto {
  days: AddFestivalDay[];
}
