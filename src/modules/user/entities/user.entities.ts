import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { EntityName } from 'src/common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { OtpEntity } from './otp.entities';
import { ProfileEntity } from './profile.entities';
import { profile } from 'console';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  profileId: number;
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;

  @Column({ unique: true, nullable: true })
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

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;
}
