import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/AuthResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashingService: HashingService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = await this.hashingService.hashPassword(
        createUserDto.password,
      );

      return this.userRepository.save(user);
    } catch (error) {
      const pgUniqueViolaitonErrorCode = '23505';
      if (error.code === pgUniqueViolaitonErrorCode)
        throw new ConflictException();
      throw error;
    }
  }
  async login(loginUser: LoginUserDto) {
    const getUser = await this.userRepository.findOne({
      where: { email: loginUser.email },
    });
    if (!getUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordTrue = await this.hashingService.comparePassword(
      loginUser.password,
      getUser.password,
    );
    if (!isPasswordTrue) {
      throw new HttpException('Password false', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: getUser.email, sub: getUser.id };
    const tokens = this.getTokens(payload);

    return tokens;
  }
  getTokens(payload: object): AuthResponseDto {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || jwtSecret;

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: jwtSecret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: refreshSecret,
      }),
    };
  }
}
