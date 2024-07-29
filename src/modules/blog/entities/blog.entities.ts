import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { IsEnum } from 'class-validator';
import { BlogStatus } from '../enum/status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entities';
import { BlogLikeEntity } from './like.entities';
import { BlogBookMarkEntity } from './bookmark.entities';
import { BlogCommentEntity } from './comment.entities';
import { BlogCategoryEntity } from './category.entities';

@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  time_for_study: string;

  @Column()
  content: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: BlogStatus.draft })
  @IsEnum(BlogStatus)
  status: BlogStatus;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  author: UserEntity;

  @OneToMany(() => BlogLikeEntity, (like) => like.blog)
  likes: BlogLikeEntity[];

  @OneToMany(() => BlogBookMarkEntity, (bookmmark) => bookmmark.blog)
  bookmarks: BlogBookMarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
  comments: BlogCommentEntity[];

  @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
  categories: BlogCategoryEntity[];
}
