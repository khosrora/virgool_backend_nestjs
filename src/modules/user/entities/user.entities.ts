import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { BlogEntity } from 'src/modules/blog/entities/blog.entities';
import { BlogBookMarkEntity } from 'src/modules/blog/entities/bookmark.entities';
import { BlogCommentEntity } from 'src/modules/blog/entities/comment.entities';
import { BlogLikeEntity } from 'src/modules/blog/entities/like.entities';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OtpEntity } from './otp.entities';
import { ProfileEntity } from './profile.entities';
import { ImageEntity } from 'src/modules/image/entities/image.entities';
import { Roles } from 'src/common/enums/roles.enum';
import { FollowEntity } from './follow.entities';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  profileId: number;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  balance: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ default: false })
  verify_phone: boolean;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true })
  new_phone: string;

  @Column({ default: false })
  verify_email: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ default: Roles.USER, nullable: true })
  role: string;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @OneToMany(() => BlogLikeEntity, (like) => like.user)
  blog_likes: BlogLikeEntity[];

  @OneToMany(() => BlogBookMarkEntity, (bookMark) => bookMark.user)
  blog_bookmarks: BlogBookMarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.user)
  blog_comments: BlogCommentEntity[];

  @OneToMany(() => ImageEntity, (image) => image.user)
  images: ImageEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.followers)
  following: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];
}
