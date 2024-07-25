import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, CookiePayload } from './types/payload.types';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET!,
      expiresIn: 60 * 2,
    });
    return token;
  }

  createAccessToken(payload: AccessTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return token;
  }

  verificationOtpToken(token: string): AccessTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
