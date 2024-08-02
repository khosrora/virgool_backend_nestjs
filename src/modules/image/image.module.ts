import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entities';
import { ImageService } from './image.service';
import { ImageController } from './image.controler';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), AuthModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [],
})
export class ImageModule {}
