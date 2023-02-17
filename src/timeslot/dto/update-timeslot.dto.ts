import { IsDate, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeslotDto } from './create-timeslot.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTimeslotDto extends PartialType(CreateTimeslotDto) {
  @ApiProperty({
    example: '2020-01-01 09:00:00+00',
    type: 'timestamp with time zone',
    required: false,
  })
  @IsDate()
  end?: Date;

  @ApiProperty({
    example: 'My awesome timestamp',
    type: 'name',
    required: false,
  })
  @IsString()
  name?: string;
}
