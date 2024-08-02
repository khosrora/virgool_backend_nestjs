import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorator/auth.decorator';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { UploadFile } from 'src/common/interceptor/upload.interceptor';
import { MulterFile } from 'src/common/utils/multer.utils';
import { ImageDto } from './dto/image.dto';
import { ImageService } from './image.service';

@Controller('image')
@ApiTags('image')
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(UploadFile('image'))
  @ApiConsumes(swaggerConsumes.Multipart)
  create(@Body() imageDto: ImageDto, @UploadedFile() image: MulterFile) {
    return this.imageService.create(imageDto, image);
  }

  @Get("/images")
  getAll() {
    try {
      return this.imageService.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/:id')
  @ApiConsumes(swaggerConsumes.Multipart)
  getImage(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.findOne(id);
  }

  @Delete('/:id')
  @ApiConsumes(swaggerConsumes.Multipart)
  deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }
}
