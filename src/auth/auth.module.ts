import { Module, Logger } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VolunteerModule } from '../volunteer/volunteer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

const jwt = () => {
  Logger.debug(process.env.JWTKEY);
  return process.env.JWTKEY;
};

@Module({
  imports: [
    VolunteerModule,
    PassportModule,
    JwtModule.register({
      secret: jwt(),
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
