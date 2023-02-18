import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';

@Injectable()
export class AdminJwtAuthGuard extends JwtAuthGuard {}
