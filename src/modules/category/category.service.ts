import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/paginate.utils';
import { Repository } from 'typeorm';
import {
  ConfilictMessage,
  NotFoundMessage,
  PublicMessage,
} from '../auth/enums/message.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let { title, priority } = createCategoryDto;
    title = await this.checkExistByTitle(title);
    const category = this.categoryRepository.create({ title, priority });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.created,
    };
  }

  async findAll(pagintaionDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(pagintaionDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(NotFoundMessage.notFound);
    return category;
  }

  async remove(id: number) {
    await this.categoryRepository.delete(id);
    return {
      message: PublicMessage.deleted,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { title, priority } = updateCategoryDto;
    await this.categoryRepository.update({ id }, { title, priority });
    return {
      message: PublicMessage.updated,
    };
  }

  async checkExistByTitle(title: string) {
    const isExist = await this.categoryRepository.findOneBy({ title });
    if (isExist) throw new ConflictException(ConfilictMessage.categoryTitle);
    return title;
  }
}
