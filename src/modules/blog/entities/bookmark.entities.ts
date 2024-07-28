import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BlogEntity } from './blog.entities';

@Entity(EntityName.bookmarks)
export class BlogBookMarkEntity extends BaseEntity {
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.blog_likes, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.likes, {
    onDelete: 'CASCADE',
  })
  blog: BlogEntity;
}
