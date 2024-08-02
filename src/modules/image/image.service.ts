import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entities';
import { Repository } from 'typeorm';
import { MulterFile } from 'src/common/utils/multer.utils';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { NotFoundMessage, PublicMessage } from '../auth/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(imageDto: ImageDto, image: MulterFile) {
    const { id: userId } = this.req.user;
    let { alt, name } = imageDto;
    let location = image?.path?.slice(7);
    if (!alt) alt = name;
    await this.imageRepository.insert({ alt, name, location, userId });
    return {
      message: PublicMessage.created,
    };
  }

  async findAll() {
    const { id: userId } = this.req.user;
    return this.imageRepository.find({
      where: { userId },
      order: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const { id: userId } = this.req.user;
    const image = await this.imageRepository.find({
      where: { userId, id },
      order: { id: 'desc' },
    });
    if (!image) throw new NotFoundException(NotFoundMessage.notFound);
    return image;
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    if (!image) throw new NotFoundException(NotFoundMessage.notFound);
    await this.imageRepository.remove(image);
    return {
      message: PublicMessage.deleted,
    };
  }
}
