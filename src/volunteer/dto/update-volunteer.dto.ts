import { SignupDto } from './signup.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateVolunteerDto extends PartialType(SignupDto) {}
