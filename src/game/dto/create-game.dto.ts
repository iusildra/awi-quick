import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum GameType {
  CHILD = 'child',
  FAMILY = 'family',
  AMBIANCE = 'ambiance',
  INITIATE = 'initiate',
  EXPERT = 'expert',
}

export class CreateGameDto {
  @ApiProperty({
    example: 'My awesome game',
    description: 'The name of the game',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'child',
    description: 'The type of the game',
    enum: GameType,
  })
  @IsEnum(GameType, { message: 'Invalid game type' })
  type: GameType;
}
