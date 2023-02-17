import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateTimeslotDto {
  @ApiProperty({
    example: '2020-01-01 09:00:00+00',
    description: 'The begin date',
    type: 'timestamp with time zone',
  })
  @IsDate()
  begin: Date;

  @ApiProperty({
    example: '2020-01-01 10:00:00+00',
    description: 'The end date',
    type: 'timestamp with time zone',
  })
  @IsDate()
  end: Date;

  @ApiProperty({
    example: 'My awesome timeslot',
    description: 'The name of the timeslot',
    type: 'string',
  })
  @IsString()
  name: string;
}
