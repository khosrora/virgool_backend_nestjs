import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { AuthService } from './auth.service';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guards';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user-existance')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  UserExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.UserExistence_service(authDto, res);
  }
  @Post('/check-otp')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp_service(checkOtpDto.code);
  }
  @Get('check-login')
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  checkLogin(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
