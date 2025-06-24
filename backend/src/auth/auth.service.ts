import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserAuth } from '../entities/user-auth.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dto/auth.dto';
import { UserStatus, UserRole } from '../enums/user.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password } = registerDto;

    const existingUser = await this.userAuthRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const profileId = uuidv4();
    const authId = uuidv4();

    const profile = this.userProfileRepository.create({
      id: profileId,
      email,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    });

    const savedProfile = await this.userProfileRepository.save(profile);

    const hashedPassword = await bcrypt.hash(password, 10);

    const userAuth = this.userAuthRepository.create({
      id: authId,
      email,
      password_hash: hashedPassword,
      profile_id: profileId,
      is_verified: false,
    });

    await this.userAuthRepository.save(userAuth);

    const payload = { email, sub: authId };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      profile: savedProfile,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const userAuth = await this.userAuthRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    if (!userAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, userAuth.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, sub: userAuth.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      profile: userAuth.profile,
    };
  }

  async validateUser(email: string): Promise<UserProfile | null> {
    const userAuth = await this.userAuthRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    return userAuth?.profile || null;
  }
}