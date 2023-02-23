import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AssignGameDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: "The games' id",
    type: 'string[]',
  })
  @IsArray()
  ids: string[];
}
