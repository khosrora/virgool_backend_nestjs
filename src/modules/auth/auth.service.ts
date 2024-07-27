import {
  BadRequestException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmail, isMobilePhone } from 'class-validator';
import { randomInt } from 'crypto';
import { Request, Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entities/otp.entities';
import { ProfileEntity } from '../user/entities/profile.entities';
import { UserEntity } from '../user/entities/user.entities';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import {
  AuthMessage,
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from './enums/message.enum';
import { AuthMethod } from './enums/method.enum';
import { AuthType } from './enums/type.enum';
import { TokenService } from './token.service';
import { AuthResponse } from './types/response.types';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
  ) {}

  async UserExistence_service(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        return this.sendResponse(res, result);
      case AuthType.register:
        result = await this.register(method, username);
        return this.sendResponse(res, result);
      default:
        throw new UnauthorizedException();
    }
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.notFoundAccount);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      userId: user.id,
      token,
      code: otp.code,
    };
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user = await this.checkExistUser(method, validUsername);
    if (user) throw new UnauthorizedException(AuthMessage.alreadyExistAccount);
    if (method === AuthMethod.Username)
      throw new BadRequestException(BadRequestMessage.InValidRegisterData);
    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);
    let otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      userId: user.id,
      token,
      code: otp.code,
    };
  }

  async checkOtp_service(code: string) {
    const token = this.request.cookies[CookieKeys.OTP];
    const now = new Date();
    if (!token) throw new UnauthorizedException(AuthMessage.expiredCode);
    const { userId } = this.tokenService.verificationOtpToken(token);

    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.tryAgain);
    if (otp.expiresIn < now)
      throw new UnauthorizedException(AuthMessage.tryAgain);
    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.loginAgain);
    const access_token = this.tokenService.createAccessToken({ userId });
    return {
      message: PublicMessage.login,
      accessToken: access_token,
    };
  }

  async saveOtp(userId: number) {
    const code = randomInt(1000, 9999).toString();
    const expires_in = new Date(Date.now() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId });
    let existOtp = false;
    if (otp) {
      existOtp = true;
      otp.code = code;
      otp.expiresIn = expires_in;
    } else {
      otp = this.otpRepository.create({ code, expiresIn: expires_in, userId });
    }
    otp = await this.otpRepository.save(otp);
    if (!existOtp) {
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    }
    // #TODO send [sms or email] otp code
    return otp;
  }

  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('email is incorecct');
      case AuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException('phone is incorecct');
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException();
    }
  }

  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity;
    if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({
        phone: username,
      });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({
        email: username,
      });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({
        username,
      });
    } else {
      throw new BadRequestException(BadRequestMessage.InValidLoginData);
    }
    return user;
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { code, token }: AuthResponse = result;
    res.cookie(CookieKeys.OTP, token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 2),
    });
    res.json({
      code,
    });
  }

  async validateOtpToken(token: string) {
    const { userId } = this.tokenService.verificationOtpToken(token);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.tryAgain);
    return user;
  }

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verificationAccessToken(token);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.tryAgain);
    return user;
  }
}
