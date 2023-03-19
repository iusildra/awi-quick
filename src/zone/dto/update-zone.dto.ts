import { ApiProperty } from '@nestjs/swagger';

export class UpdateZoneDto {
  @ApiProperty({
    example: 'My Awesome zone',
    type: 'string',
  })
  name: string;
}
