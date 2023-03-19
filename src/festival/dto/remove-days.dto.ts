import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class RemoveFestivalDaysDto {
  @ApiProperty({
    type: [Number],
    description:
      'Array of days id to remove. Also remove every timeslots associated with these days.',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  days: number[];
}
