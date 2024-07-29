import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entities';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './entities/blog.entities';
import { BlogCategoryEntity } from './entities/category.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity, CategoryEntity, BlogCategoryEntity]),
    AuthModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule {}
