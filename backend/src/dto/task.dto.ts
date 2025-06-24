import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { TaskStatus, TaskLabel, TaskPriority } from '../enums/task.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskLabel)
  @IsOptional()
  label?: TaskLabel;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}

export class UpdateTaskDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskLabel)
  @IsOptional()
  label?: TaskLabel;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}

export class TaskResponseDto {
  id: number;
  title: string;
  status: TaskStatus;
  label: TaskLabel;
  priority: TaskPriority;
  gmt_created: Date;
  gmt_modified: Date;
}