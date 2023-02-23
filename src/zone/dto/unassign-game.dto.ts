import { PartialType } from '@nestjs/swagger';
import { AssignGameDto } from './assign-game.dto';

export class UnassignGameDto extends PartialType(AssignGameDto) {}
