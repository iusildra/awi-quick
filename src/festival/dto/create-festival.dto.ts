import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { AddFestivalDay } from './add-days.dto';

export class CreateFestivalDto {
  @ApiProperty({
    example: 'My Awesome Festival',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 2023,
    type: 'number',
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    example: 4,
    type: 'number',
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    type: [AddFestivalDay],
  })
  festival_days: AddFestivalDay[];
}
