import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OtpEntity } from './entities/otp.entities';
import { ProfileEntity } from './entities/profile.entities';
import { UserEntity } from './entities/user.entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FollowEntity } from './entities/follow.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      OtpEntity,
      FollowEntity,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
