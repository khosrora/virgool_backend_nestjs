import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/decorator/Pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create-category')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/categories')
  @Pagination()
  findAll(@Query() pagintaionDto: PaginationDto) {
    return this.categoryService.findAll(pagintaionDto);
  }

  @Get(':id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Delete(':id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @Put(':id')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }
}
