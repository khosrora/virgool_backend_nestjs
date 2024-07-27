import { Column, Entity, OneToOne } from 'typeorm';
import { EntityName } from 'src/common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { UserEntity } from './user.entities';

@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntity {
  @Column()
  userId: number;
  @OneToOne(() => UserEntity, (user) => user.profile , { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ nullable: true })
  nick_name: string;
  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  image_profile: string;
  @Column({ nullable: true })
  bg_profile: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birthday: Date;
  @Column({ nullable: true })
  linkdin_profile: string;
}
