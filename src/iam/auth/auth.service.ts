import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashingService: HashingService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
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
  login(loginUserDto: LoginUserDto) {
    throw new Error('Method not implemented.');
  }
}
