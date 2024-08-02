import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entities';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { BlogEntity } from './entities/blog.entities';
import { BlogCategoryEntity } from './entities/category.entities';
import { BlogLikeEntity } from './entities/like.entities';
import { BlogBookMarkEntity } from './entities/bookmark.entities';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { BlogCommentEntity } from './entities/comment.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryEntity,
      BlogCategoryEntity,
      BlogLikeEntity,
      BlogBookMarkEntity,
      BlogCommentEntity,
    ]),
    AuthModule,
  ],
  controllers: [BlogController, CommentController],
  providers: [BlogService, CommentService, CategoryService],
})
export class BlogModule {}
