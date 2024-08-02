import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entities';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity(EntityName.image)
export class ImageEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  alt: string;

  @ManyToOne(() => UserEntity, (user) => user.images, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  userId: number;

  // @AfterUpdate()
  // @AfterInsert()
  // @AfterLoad()
  // map() {
  //   this.location = 'test';
  // }
}
