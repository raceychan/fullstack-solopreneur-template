import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserProfile } from '../entities/user-profile.entity';
import { UserAuth } from '../entities/user-auth.entity';
import { Task } from '../entities/task.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.db',
  entities: [UserProfile, UserAuth, Task],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
};