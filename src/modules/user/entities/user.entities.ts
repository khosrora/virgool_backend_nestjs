import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { EntityName } from 'src/common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { OtpEntity } from './otp.entities';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;
}