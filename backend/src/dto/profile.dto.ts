import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { UserStatus, UserRole } from '../enums/user.enum';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class UpdateProfileDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class ProfileResponseDto {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email: string;
  phone_number?: string;
  status: UserStatus;
  role: UserRole;
  gmt_created: Date;
  gmt_modified: Date;
}