import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './entities/blog.entities';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), AuthModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
