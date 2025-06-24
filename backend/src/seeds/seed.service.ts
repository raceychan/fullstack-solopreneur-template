import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskStatus, TaskLabel, TaskPriority } from '../enums/task.enum';
import * as taskSeedData from './task-seed.json';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async onModuleInit() {
    await this.seedTasks();
  }

  private async seedTasks() {
    const existingTasks = await this.taskRepository.count();
    
    if (existingTasks === 0) {
      console.log('Seeding tasks...');
      
      for (const taskData of taskSeedData) {
        const task = this.taskRepository.create({
          title: taskData.title,
          status: taskData.status as TaskStatus,
          label: taskData.label as TaskLabel,
          priority: taskData.priority as TaskPriority,
        });
        await this.taskRepository.save(task);
      }
      
      console.log(`Seeded ${taskSeedData.length} tasks`);
    }
  }
}