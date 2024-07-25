import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
