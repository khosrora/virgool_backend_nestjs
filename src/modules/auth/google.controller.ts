import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('/auth/google')
@ApiTags('google auth')
@UseGuards(AuthGuard('google'))
export class GoogleAuthController {
  constructor(private authService: AuthService) {}

  @Get()
  googleLogin(@Req() req) {}

  @Get('/redirect')
  googleRedirect(@Req() req) {
    const userData = req.user;
    this.authService.googleAuth(userData);
    return req.user;
  }
}
