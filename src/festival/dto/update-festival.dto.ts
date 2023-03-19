import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFestivalDto } from './create-festival.dto';

export class UpdateFestivalDto extends PartialType(
  OmitType(CreateFestivalDto, ['festival_days']),
) {}
