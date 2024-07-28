import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { AuthGuard } from '../auth/guards/auth.guards';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';

@Controller()
@ApiTags('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  
  @Post('/create_blog')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }
}
