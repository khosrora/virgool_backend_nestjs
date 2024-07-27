import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../user/entities/otp.entities';
import { ProfileEntity } from '../user/entities/profile.entities';
import { UserEntity } from '../user/entities/user.entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService, TypeOrmModule],
})
export class AuthModule {}
