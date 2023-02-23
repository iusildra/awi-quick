import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'My Awesome zone',
    type: 'string',
  })
  @IsString()
  @Length(3, 255)
  name: string;
}
