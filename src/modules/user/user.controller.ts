import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadFileOptional } from 'src/common/decorator/UploadFile.decorator';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { CookieOptionToken } from 'src/common/utils/cookie.utils';
import { multerStorage } from 'src/common/utils/multer.utils';
import { PublicMessage } from '../auth/enums/message.enum';
import { AuthGuard } from '../auth/guards/auth.guards';
import {
  ChangeEmailDto,
  ChangePhoneDto,
  ChangeUsernameDto,
  ProfileDto,
  VerifyCodeDto,
} from './dto/profile.dto';
import { ProfileImages } from './types/files';
import { UserService } from './user.service';

@Controller()
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiConsumes(swaggerConsumes.Multipart)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image_profile', maxCount: 1 },
        { name: 'bg_profile', maxCount: 1 },
      ],
      {
        storage: multerStorage('user-profile'),
      },
    ),
  )
  changeProfile(
    @Body() profileDto: ProfileDto,
    @UploadFileOptional() files: ProfileImages,
  ) {
    return this.userService.changeProfile(profileDto, files);
  }

  @Get('/profile')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(swaggerConsumes.urlEncoded)
  @UseGuards(AuthGuard)
  profile() {
    return this.userService.profile();
  }

  @Get('/followToggle/:followingId')
  @ApiParam({ name: 'followingId' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  follow(@Param('followingId', ParseIntPipe) followingId: number) {
    return this.userService.followToggle(followingId);
  }

  @Patch('/change-email')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(swaggerConsumes.urlEncoded)
  @UseGuards(AuthGuard)
  async changeEmail(
    @Body() changeEmailDto: ChangeEmailDto,
    @Res() res: Response,
  ) {
    const { code, message, token } = await this.userService.changeEmail(
      changeEmailDto.email,
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EMAIL_OTP, token, CookieOptionToken());
    res.json({
      code,
      message: PublicMessage.updated,
    });
  }

  @Post('/verify-email-otp')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(swaggerConsumes.urlEncoded)
  @UseGuards(AuthGuard)
  verifyEmail(@Body() otpDto: VerifyCodeDto) {
    return this.userService.verifyEmail(otpDto.code);
  }

  @Patch('/change-phone')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(swaggerConsumes.urlEncoded)
  @UseGuards(AuthGuard)
  async changePhone(
    @Body() changePhoneDto: ChangePhoneDto,
    @Res() res: Response,
  ) {
    const { code, message, token } = await this.userService.changePhone(
      changePhoneDto.phone,
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.PHONE_OTP, token, CookieOptionToken());
    res.json({
      code,
      message: PublicMessage.updated,
    });
  }

  @Post('/verify-phone-otp')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(swaggerConsumes.urlEncoded)
  @UseGuards(AuthGuard)
  verifyPhone(@Body() otpDto: VerifyCodeDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Patch('change-username')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(swaggerConsumes.urlEncoded)
  @UseGuards(AuthGuard)
  changeUsername(@Body() changeUsernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(changeUsernameDto.username);
  }
}
