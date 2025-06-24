import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserStatus, UserRole } from '../enums/user.enum';
import { UserAuth } from './user-auth.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({
    type: 'varchar',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  gmt_created: Date;

  @UpdateDateColumn()
  gmt_modified: Date;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.profile)
  auth: UserAuth;
}