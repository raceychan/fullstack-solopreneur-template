import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
} from '../dto/task.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @Query(ValidationPipe) paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<TaskResponseDto>> {
    return this.tasksService.findAll(paginationDto);
  }

  @Put()
  async update(
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(updateTaskDto);
  }

  @Delete()
  async remove(@Body('id') id: number): Promise<{ message: string }> {
    await this.tasksService.remove(id);
    return { message: 'Task deleted successfully' };
  }
}