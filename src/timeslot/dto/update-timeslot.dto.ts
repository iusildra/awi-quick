import { IsDate, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeslotDto } from './create-timeslot.dto';

export class UpdateTimeslotDto extends PartialType(CreateTimeslotDto) {
  @IsDate()
  end?: Date;

  @IsString()
  name?: string;
}
