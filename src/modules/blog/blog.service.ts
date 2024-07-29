import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { createSlug } from 'src/common/utils/function.utils';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BadRequestMessage, PublicMessage } from '../auth/enums/message.enum';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { BlogEntity } from './entities/blog.entities';
import { randomId } from 'src/common/utils/function.utils';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/paginate.utils';
import { isArray } from 'class-validator';
import { CategoryEntity } from '../category/entities/category.entities';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/category.entities';
import { EntityName } from 'src/common/enums/entity.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private categoryService: CategoryService,
    @Inject(REQUEST) private request: Request,
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
    const isExist = await this.checkBlogBySlut(slugData);

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

    if (search) {
    }

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
      .addSelect(['categories.id', 'category.title'])
      .where(where, { category, search })
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

  async checkBlogBySlut(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }
}
