import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('user_auth')
export class UserAuth {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column()
  profile_id: string;

  @CreateDateColumn()
  gmt_created: Date;

  @UpdateDateColumn()
  gmt_modified: Date;

  @OneToOne(() => UserProfile, (profile) => profile.auth)
  @JoinColumn({ name: 'profile_id' })
  profile: UserProfile;
}