import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/paginate.utils';
import {
  NotFoundMessage,
  PublicMessage,
} from 'src/modules/auth/enums/message.enum';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entities';
import { BlogService } from './blog.service';

@Injectable({ scope: Scope.REQUEST })
export class CommentService {
  constructor(
    @InjectRepository(BlogCommentEntity)
    private blogCommentRepository: Repository<BlogCommentEntity>,
    @Inject(forwardRef(() => BlogService)) private blogService: BlogService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { id: userId } = this.request.user;
    const { parentId, text, blogId } = createCommentDto;
    await this.blogService.checkBlogById(blogId);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.blogCommentRepository.findOneBy({
        id: +parentId,
      });
    }

    await this.blogCommentRepository.insert({
      text,
      accepted: false,
      blogId,
      parentId,
      userId,
    });

    return {
      message: PublicMessage.created,
    };
  }

  async accept(id: number) {
    const comment = await this.checkExistCommentById(id);
    if (comment.accepted) {
      throw new BadGatewayException();
    }
    comment.accepted = true;
    this.blogCommentRepository.save(comment);
    return {
      message: PublicMessage.updated,
    };
  }

  async reject(id: number) {
    const comment = await this.checkExistCommentById(id);
    if (!comment.accepted) {
      throw new BadGatewayException();
    }
    comment.accepted = false;
    this.blogCommentRepository.save(comment);
    return {
      message: PublicMessage.updated,
    };
  }

  async getAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {},
      skip,
      take: limit,
      order: { id: 'desc' },
      relations: {
        blog: true,
        user: { profile: true },
      },
      select: {
        blog: {
          title: true,
        },
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
      },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      comments,
    };
  }

  async commentsOfBlog(blogId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {
        blogId,
        parentId: IsNull(),
      },
      skip,
      take: limit,
      order: { id: 'desc' },
      relations: {
        user: { profile: true },
        children: {
          blog: true,
          user: { profile: true },
        },
      },
      select: {
     
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
      },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      comments,
    };
  }

  async checkExistCommentById(id: number) {
    const comment = this.blogCommentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException(NotFoundMessage.notFound);
    return comment;
  }
}
