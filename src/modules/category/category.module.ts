import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entities';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
