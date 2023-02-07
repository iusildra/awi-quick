import { PartialType } from '@nestjs/mapped-types';
import { AssignGameDto } from './assign-game.dto';

export class UnassignGameDto extends PartialType(AssignGameDto) {
  ids: string[];
}
