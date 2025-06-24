import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
} from '../dto/task.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);
    return this.toResponseDto(savedTask);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<TaskResponseDto>> {
    const { offset = 0, limit = 10 } = paginationDto;

    const [tasks, total] = await this.taskRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { gmt_created: 'DESC' },
    });

    return {
      data: tasks.map((task) => this.toResponseDto(task)),
      total,
      offset,
      limit,
    };
  }

  async findOne(id: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.toResponseDto(task);
  }

  async update(updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    const { id, ...updateData } = updateTaskDto;

    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateData);
    const updatedTask = await this.taskRepository.save(task);

    return this.toResponseDto(updatedTask);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  private toResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      label: task.label,
      priority: task.priority,
      gmt_created: task.gmt_created,
      gmt_modified: task.gmt_modified,
    };
  }
}