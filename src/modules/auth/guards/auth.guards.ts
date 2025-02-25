import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { SKIP_AUTH } from 'src/common/decorator/Skip-auth.decorator';
import { AuthService } from '../auth.service';
import { AuthMessage } from '../enums/message.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isSkipedAuthorization = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler(),
    );
    if (isSkipedAuthorization) return true;
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);

    request.user = await this.authService.validateAccessToken(token);
    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;

    if (!authorization || authorization?.trim() === '') {
      throw new UnauthorizedException(AuthMessage.loginAgain);
    }
    const [bearer, token] = authorization.split(' ');

    if (bearer.toLocaleLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException(AuthMessage.loginAgain);
    }
    return token;
  }
}
