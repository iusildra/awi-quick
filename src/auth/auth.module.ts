import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Volunteer } from 'src/entities';

@Module({
  imports: [SequelizeModule.forFeature([Volunteer])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
