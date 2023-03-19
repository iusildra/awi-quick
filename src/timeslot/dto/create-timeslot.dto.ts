import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateTimeslotDto {
  @ApiProperty({
    example: '2020-01-01 09:00:00+00',
    description: 'The begin date',
    type: 'timestamp with time zone',
  })
  @IsDate()
  start: Date;

  @ApiProperty({
    example: '2020-01-01 10:00:00+00',
    description: 'The end date',
    type: 'timestamp with time zone',
  })
  @IsDate()
  end: Date;

  @ApiProperty({
    example: 1,
    description: 'The id of a festival day',
    type: 'number',
  })
  @IsString()
  festival_day_id: number;
}
