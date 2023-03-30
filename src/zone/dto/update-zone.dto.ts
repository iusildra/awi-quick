import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateZoneDto {
  @ApiProperty({
    example: 'My Awesome zone',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 5,
    type: 'number',
  })
  @IsNumber()
  @Min(0)
  nb_volunteers: number;
}
