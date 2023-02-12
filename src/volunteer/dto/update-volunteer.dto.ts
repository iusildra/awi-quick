import { SignupDto } from './signup.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateVolunteerDto extends PartialType(SignupDto) {}
