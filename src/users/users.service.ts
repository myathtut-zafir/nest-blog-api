import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../iam/auth/dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/iam/auth/jwt-payload.interface';

@Injectable()
export class UsersService {
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

  async getProfile(id: number) {
    console.log('getProfile called with id:', id);
    return this.userRepository.findOne({
      where: { id },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
