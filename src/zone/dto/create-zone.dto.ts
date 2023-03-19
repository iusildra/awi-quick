import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, IsNumber } from 'class-validator';

export class CreateZoneDto {
  @ApiProperty({
    example: 'My Awesome zone',
    type: 'string',
  })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiProperty({
    example: 'Festival du jeu !',
    type: 'uuid',
  })
  @IsUUID()
  festival_id: string;

  @ApiProperty({
    example: 5,
    type: 'number',
  })
  @IsNumber()
  nb_volunteers: number;
}
