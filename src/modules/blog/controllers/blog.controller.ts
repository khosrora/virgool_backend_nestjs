import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilterBlog } from 'src/common/decorator/FilterBlog.decorator';
import { Pagination } from 'src/common/decorator/Pagination.decorator';
import { skipAuth } from 'src/common/decorator/Skip-auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from './../dto/blog.dto';
import { AuthDecorator } from 'src/common/decorator/auth.decorator';

@Controller('blog')
@ApiTags('blogs')
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/create_blog')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get('/my')
  getBlogs() {
    return this.blogService.getMyBlogs();
  }

  @Get('/blogs')
  @Pagination()
  @skipAuth()
  @FilterBlog()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterBlogDto: FilterBlogDto,
  ) {
    return this.blogService.blogsList(paginationDto, filterBlogDto);
  }

  @Delete('/:id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.deleteBlog(id);
  }

  @Put('/:id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }

  @Get('/like/:id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  likeToggle(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.likeToggleBlog(id);
  }

  @Get('/bookmark/:id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  bookmarkToggle(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggleBlog(id);
  }

  @Get('/blog/:slug')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  @Pagination()
  @skipAuth()
  getBySlug(
    @Param('slug') slug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.blogService.findOne(slug, paginationDto);
  }
}
