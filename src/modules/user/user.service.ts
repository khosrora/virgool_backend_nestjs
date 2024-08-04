import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate } from 'class-validator';
import { Request } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import {
  AuthMessage,
  BadRequestMessage,
  ConfilictMessage,
  PublicMessage,
} from '../auth/enums/message.enum';
import { AuthMethod } from '../auth/enums/method.enum';
import { TokenService } from '../auth/token.service';
import { ProfileDto } from './dto/profile.dto';
import { OtpEntity } from './entities/otp.entities';
import { ProfileEntity } from './entities/profile.entities';
import { UserEntity } from './entities/user.entities';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import { FollowEntity } from './entities/follow.entities';
import { EntityName } from 'src/common/enums/entity.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepositry: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepositry: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepositry: Repository<OtpEntity>,
    @InjectRepository(FollowEntity)
    private followRepositry: Repository<FollowEntity>,
    @Inject(REQUEST) private request: Request,
    private authServise: AuthService,
    private tokenService: TokenService,
  ) {}

  async changeProfile(profileDto: ProfileDto, files: ProfileImages) {
    if (files?.image_profile?.length > 0) {
      let [image] = files.image_profile;
      profileDto.image_profile = image.path.slice(7);
    }
    if (files?.bg_profile?.length > 0) {
      let [image] = files?.bg_profile;
      profileDto.bg_profile = image.path.slice(7);
    }

    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepositry.findOneBy({ id: userId });
    const {
      bio,
      birthday,
      gender,
      linkdin_profile,
      nick_name,
      image_profile,
      bg_profile,
    } = profileDto;
    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = birthday;
      if (gender && Object.values(Gender).includes(gender))
        profile.gender = gender;
      if (linkdin_profile) profile.linkdin_profile = linkdin_profile;
      if (nick_name) profile.nick_name = nick_name;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_profile) profile.bg_profile = bg_profile;
    } else {
      profile = this.profileRepositry.create({
        bio,
        birthday,
        gender,
        linkdin_profile,
        nick_name,
        userId,
      });
    }
    await this.profileRepositry.save(profile);
    if (!profileId) {
      await this.userRepositry.update(
        { id: userId },
        { profileId: profile.id },
      );
    }
    return {
      message: PublicMessage.updated,
    };
  }

  async profile() {
    const { id } = this.request.user;
    return this.userRepositry
      .createQueryBuilder(EntityName.User)
      .where({ id })
      .leftJoinAndSelect('user.profile', 'profile')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .getOne();
  }

  async followToggle(followingId: number) {
    const { id: userId } = this.request.user;
    const following = this.userRepositry.findOneBy({ id: followingId });
    if (!following) throw new NotFoundException();
    const isFollowing = await this.followRepositry.findOneBy({
      followingId,
      followerId: userId,
    });
    if (isFollowing) {
      await this.followRepositry.remove(isFollowing);
    } else {
      await this.followRepositry.insert({ followingId, followerId: userId });
    }
    return {
      message: PublicMessage.updated,
    };
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepositry.findOneBy({ email });
    if (user && user.id !== id) {
      throw new ConflictException(ConfilictMessage.email);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.updated,
      };
    }
    await this.userRepositry.update(
      { id },
      {
        new_email: email,
      },
    );
    const otp = await this.authServise.saveOtp(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;
    const token = this.request.cookies[CookieKeys.EMAIL_OTP];
    if (!token) throw new BadRequestException(AuthMessage.expiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== new_email)
      throw new BadRequestException(BadRequestMessage.invalidEmail);
    const otp = await this.checkOtp(userId, code);
    if (otp.method !== AuthMethod.Email)
      throw new BadRequestException(BadRequestMessage.invalidEmail);
    this.userRepositry.update(
      { id: userId },
      { email, verify_email: true, new_email: null },
    );
    return {
      message: PublicMessage.updated,
    };
  }

  async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepositry.findOneBy({ phone });
    if (user && user.id !== id) {
      throw new ConflictException(ConfilictMessage.phone);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.updated,
      };
    }
    await this.userRepositry.update(
      { id },
      {
        new_phone: phone,
      },
    );
    const otp = await this.authServise.saveOtp(id, AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;
    const token = this.request.cookies[CookieKeys.PHONE_OTP];
    if (!token) throw new BadRequestException(AuthMessage.expiredCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);
    if (phone !== new_phone)
      throw new BadRequestException(BadRequestMessage.invalidPhone);
    const otp = await this.checkOtp(userId, code);
    if (otp.method !== AuthMethod.Phone)
      throw new BadRequestException(BadRequestMessage.invalidPhone);
    this.userRepositry.update(
      { id: userId },
      { phone, verify_phone: true, new_phone: null },
    );
    return {
      message: PublicMessage.updated,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepositry.findOneBy({ id: userId });
    const now = new Date();
    if (!otp) throw new BadRequestException(AuthMessage.tryAgain);
    if (otp.expiresIn < now)
      throw new BadRequestException(AuthMessage.tryAgain);
    if (otp.code !== code)
      throw new BadRequestException(AuthMessage.loginAgain);
    return otp;
  }

  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepositry.findOneBy({ username });
    if (user && user.id !== id) {
      throw new ConflictException(ConfilictMessage.username);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.updated,
      };
    }
    await this.userRepositry.update(
      { id },
      {
        username: username,
      },
    );
    return {
      message: PublicMessage.updated,
    };
  }
}
