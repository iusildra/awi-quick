import { PartialType } from '@nestjs/mapped-types';
import { AssignGameDto } from './assign-game.dto';
import { IsArray } from 'class-validator';

export class UnassignGameDto extends PartialType(AssignGameDto) {
  @IsArray()
  ids: string[];
}
