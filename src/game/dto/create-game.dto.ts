export class CreateGameDto {
  name: string;
  type: GameType;
}

export enum GameType {
  CHILD = 'child',
  FAMILY = 'family',
  AMBIANCE = 'ambiance',
  INITIATE = 'initiate',
  EXPERT = 'expert',
}
