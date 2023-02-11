import { IsArray } from 'class-validator';

export class AssignGameDto {
  @IsArray()
  ids: string[];
}
