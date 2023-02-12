import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VolunteerModule } from '../volunteer/volunteer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CheckExistingMiddleware } from '../volunteer/middlewares/check-existing.middleware';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    VolunteerModule,
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckExistingMiddleware).forRoutes({
      path: 'auth/signup',
      method: RequestMethod.POST,
    });
  }
}
