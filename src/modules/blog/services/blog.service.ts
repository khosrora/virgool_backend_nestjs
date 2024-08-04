import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
import { Request } from 'express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EntityName } from 'src/common/enums/entity.enum';
import { createSlug, randomId } from 'src/common/utils/function.utils';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/paginate.utils';
import { DataSource, Repository } from 'typeorm';
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from '../../auth/enums/message.enum';
import { CategoryService } from '../../category/category.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogEntity } from '../entities/blog.entities';
import { BlogBookMarkEntity } from '../entities/bookmark.entities';
import { BlogCategoryEntity } from '../entities/category.entities';
import { BlogLikeEntity } from '../entities/like.entities';
import { CommentService } from './comment.service';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikeEntity)
    private blogLikeRepository: Repository<BlogLikeEntity>,
    @InjectRepository(BlogBookMarkEntity)
    private blogBookmarkRepository: Repository<BlogBookMarkEntity>,
    private categoryService: CategoryService,
    private commentService: CommentService,
    @Inject(REQUEST) private request: Request,
    private dataSource: DataSource,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user;
    let { title, slug, content, description, time_for_study, categories } =
      blogDto;
    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories?.split(',');
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.invalidCategories);
    }

    let slugData = slug ?? title;

    slug = createSlug(slugData);
    const isExist = await this.checkBlogBySlug(slugData);

    if (!!isExist) {
      slug += `-${randomId()}`;
    }

    let blog = this.blogRepository.create({
      title,
      slug,
      content,
      description,
      time_for_study,
      authorId: user.id,
    });
    blog = await this.blogRepository.save(blog);

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: PublicMessage.created,
    };
  }
  async updateBlog(id: number, blogDto: UpdateBlogDto) {
    const user = this.request.user;
    let { title, slug, content, description, time_for_study, categories } =
      blogDto;
    let blog = await this.checkBlogById(id);
    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories?.split(',');
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.invalidCategories);
    }

    let slugData = null;
    if (title) {
      slugData = title;
      blog.title = title;
    }
    if (slug) slugData = slug;

    if (slugData) {
      slug = createSlug(slugData);
      const isExist = await this.checkBlogBySlug(slug);
      if (!!isExist && isExist.id !== id) {
        slug += `-${randomId()}`;
      }
      blog.slug = slug;
    }

    if (description) blog.description = description;
    if (content) blog.content = content;
    if (time_for_study) blog.time_for_study = time_for_study;

    await this.blogRepository.save(blog);

    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepository.delete({ blogId: blog.id });
    }
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: PublicMessage.updated,
    };
  }

  async getMyBlogs() {
    const { id: authorId } = this.request.user;
    return this.blogRepository.find({
      where: { authorId },
      order: { id: 'desc' },
    });
  }

  async blogsList(paginationDto: PaginationDto, filterBlogDto: FilterBlogDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    let { category, search } = filterBlogDto;

    // let where: FindOptionsWhere<BlogEntity> = {};
    // if (category) {
    //   where['categories'] = {
    //     category: {
    //       title: category,
    //     },
    //   };
    // }
    let where = '';
    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += ' AND ';
      where += 'category.title = LOWER(:category)';
    }
    if (search) {
      if (where.length > 0) where += ' AND ';
      search = `%${search}%`;
      where +=
        'CONCAT(blog.title, blog.description, blog.content) ILIKE :search';
    }

    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'author.id',
        'profile.nick_name',
      ])
      .where(where, { category, search })
      .loadRelationIdAndMap('blog.likes', 'blog.likes')
      .loadRelationIdAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationIdAndMap(
        'blog.comments',
        'blog.comments',
        'comments',
        (qb) => qb.where('comments.accepted = :accepted', { accepted: true }),
      )
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // const [blogs, count] = await this.blogRepository.findAndCount({
    //   relations: {
    //     categories: {
    //       category: true,
    //     },
    //   },
    //   where,
    //   select: {
    //     categories: {
    //       id: true,
    //       category: {
    //         title: true,
    //       },
    //     },
    //   },
    //   order: {
    //     id: 'desc',
    //   },
    //   skip,
    //   take: limit,
    // });
    return {
      pagination: paginationGenerator(count, page, limit),
      blogs,
    };
  }

  async findOne(slug: string, paginationDto: PaginationDto) {
    const userId = this.request?.user?.id;
    const blog = await this.blogRepository
      .createQueryBuilder(EntityName.Blog)
      .leftJoinAndSelect('blog.categories', 'categories')
      .leftJoinAndSelect('categories.category', 'category')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .where('blog.slug = :slug', { slug })
      .loadRelationCountAndMap('blog.likesCount', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarksCount', 'blog.bookmarks')
      // .loadRelationCountAndMap(
      //   'blog.commentsCount',
      //   'blog.comments',
      //   'comments',
      //   (qb) => qb.where('comments.accepted = :accepted', { accepted: true }),
      // )
      .getOne();
    if (!blog) throw new NotFoundException(NotFoundMessage.notFound);

    let isLiked = false;
    let isBookmarked = false;

    if (userId && !isNaN(userId) && userId > 0) {
      isLiked = !!(await this.blogLikeRepository.findOneBy({
        userId,
        blogId: blog.id,
      }));

      isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({
        userId,
        blogId: blog.id,
      }));
    }

    const commentsData = await this.commentService.commentsOfBlog(
      blog.id,
      paginationDto,
    );

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const suggestBlog = await queryRunner.query(`
          WITH suggested_blogs AS (
              SELECT b.*
              FROM blog b 
              ORDER BY RANDOM()
              LIMIT 3
          ) 
          SELECT * FROM suggested_blogs    
    `);

    return {
      commentsData,
      suggestBlog,
      isLiked,
      isBookmarked,
    };
  }

  async deleteBlog(id: number) {
    await this.checkExistBlog(id);
    await this.blogRepository.delete({ id });
    return {
      message: PublicMessage.deleted,
    };
  }

  async likeToggleBlog(blogId: number) {
    const { id: userId } = this.request.user;
    const blog = await this.checkBlogById(blogId);
    const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });
    if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
    } else {
      await this.blogLikeRepository.insert({ blogId, userId });
    }
    return {
      message: PublicMessage.updated,
    };
  }

  async bookmarkToggleBlog(blogId: number) {
    const { id: userId } = this.request.user;
    await this.checkBlogById(blogId);
    const isLiked = await this.blogBookmarkRepository.findOneBy({
      userId,
      blogId,
    });
    if (isLiked) {
      await this.blogBookmarkRepository.delete({ id: isLiked.id });
    } else {
      await this.blogBookmarkRepository.insert({ blogId, userId });
    }
    return {
      message: PublicMessage.updated,
    };
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }

  async checkBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    return blog;
  }

  async checkExistBlog(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.notFound);
    return blog;
  }
}
