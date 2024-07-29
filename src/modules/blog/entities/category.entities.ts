import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BlogEntity } from './blog.entities';

@Entity(EntityName.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
  @Column()
  blogId: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.categories, {
    onDelete: 'CASCADE',
  })
  blog: BlogEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.blog_categories, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;
}
