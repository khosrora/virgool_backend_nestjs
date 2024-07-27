import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { UploadFileOptional } from 'src/common/decorator/UploadFile.decorator';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import {
  multerDestination,
  multerFileName,
  multerStorage,
} from 'src/common/utils/multer.utils';
import { AuthGuard } from '../auth/guards/auth.guards';
import { ProfileDto } from './dto/profile.dto';
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
}
