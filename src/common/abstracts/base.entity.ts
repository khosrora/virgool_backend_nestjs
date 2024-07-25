import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  create_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
