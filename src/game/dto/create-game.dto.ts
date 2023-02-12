import { IsEnum, IsString } from 'class-validator';

export enum GameType {
  CHILD = 'child',
  FAMILY = 'family',
  AMBIANCE = 'ambiance',
  INITIATE = 'initiate',
  EXPERT = 'expert',
}

export class CreateGameDto {
  @IsString()
  name: string;

  @IsEnum(GameType, { message: 'Invalid game type' })
  type: GameType;
}
