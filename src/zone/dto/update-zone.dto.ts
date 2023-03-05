import { ApiProperty } from '@nestjs/swagger';

export interface RoomUpdate {
  id: number;
  name?: string;
  zone_id: number;
  tableCount?: number;
}

export class UpdateZoneDto {
  @ApiProperty({
    example: [{ id: 1, name: 'My awesome zone' }],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'The id of the zone' },
        name: { type: 'string', description: 'The name of the zone' },
      },
    },
  })
  zoneUpdates: {
    id: number;
    name: string;
  }[];

  @ApiProperty({
    example: [{ id: 1, name: 'My awesome room' }],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'The id of the room',
        },
        name: { type: 'string', description: 'The name of the room' },
        tableCount: {
          type: 'number',
          description:
            'The number of tables. If not provided, no change is made',
        },
      },
    },
  })
  roomUpdates: RoomUpdate[];
}
