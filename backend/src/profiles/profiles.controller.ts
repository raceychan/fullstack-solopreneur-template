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
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponseDto,
} from '../dto/profile.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Controller('api/v1/profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  async findAll(
    @Query(ValidationPipe) paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<ProfileResponseDto>> {
    return this.profilesService.findAll(paginationDto);
  }

  @Put()
  async update(
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.update(updateProfileDto);
  }

  @Delete()
  async remove(@Body('id') id: string): Promise<{ message: string }> {
    await this.profilesService.remove(id);
    return { message: 'Profile deleted successfully' };
  }
}