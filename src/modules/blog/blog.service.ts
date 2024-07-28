import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { createSlug } from 'src/common/utils/function.utils';
import { Repository } from 'typeorm';
import { PublicMessage } from '../auth/enums/message.enum';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogEntity } from './entities/blog.entities';
import { randomId } from 'src/common/utils/function.utils';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user;
    let { title, slug, content, description, time_for_study, image } = blogDto;
    let slugData = slug ?? title;

    slug = createSlug(slugData);
    const isExist = await this.checkBlogBySlut(slugData);

    if (!!isExist) {
      slug += `-${randomId()}`;
    }

    const blog = this.blogRepository.create({
      title,
      slug,
      content,
      description,
      time_for_study,
      authorId: user.id,
    });

    await this.blogRepository.save(blog);
    return {
      message: PublicMessage.created,
    };
  }

  async checkBlogBySlut(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }
}
