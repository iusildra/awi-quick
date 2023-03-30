import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateZoneDto {
  @ApiProperty({
    example: 'My Awesome zone',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    example: 5,
    type: 'number',
  })
  @IsNumber()
  nb_volunteers: number;
}
