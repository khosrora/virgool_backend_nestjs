import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilterBlog } from 'src/common/decorator/FilterBlog.decorator';
import { Pagination } from 'src/common/decorator/Pagination.decorator';
import { skipAuth } from 'src/common/decorator/Skip-auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { AuthGuard } from '../auth/guards/auth.guards';
import { BlogService } from './blog.service';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';

@Controller('blog')
@ApiTags('blogs')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
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
    return this.blogService.blogsList(paginationDto ,filterBlogDto);
  }
}
