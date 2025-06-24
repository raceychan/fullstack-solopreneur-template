import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/user-profile.entity';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponseDto,
} from '../dto/profile.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    const profile = this.profileRepository.create({
      id: uuidv4(),
      ...createProfileDto,
    });

    const savedProfile = await this.profileRepository.save(profile);
    return this.toResponseDto(savedProfile);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<ProfileResponseDto>> {
    const { offset = 0, limit = 10 } = paginationDto;

    const [profiles, total] = await this.profileRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { gmt_created: 'DESC' },
    });

    return {
      data: profiles.map((profile) => this.toResponseDto(profile)),
      total,
      offset,
      limit,
    };
  }

  async findOne(id: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.toResponseDto(profile);
  }

  async update(updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const { id, ...updateData } = updateProfileDto;

    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    Object.assign(profile, updateData);
    const updatedProfile = await this.profileRepository.save(profile);

    return this.toResponseDto(updatedProfile);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Profile not found');
    }
  }

  private toResponseDto(profile: UserProfile): ProfileResponseDto {
    return {
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      username: profile.username,
      email: profile.email,
      phone_number: profile.phone_number,
      status: profile.status,
      role: profile.role,
      gmt_created: profile.gmt_created,
      gmt_modified: profile.gmt_modified,
    };
  }
}