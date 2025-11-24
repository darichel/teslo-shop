import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDbErros(error);
    }
  }

  private handleDbErros(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(`Error, ${error.detail}`);
    }

    console.log(error);

    throw new BadRequestException('Unexpected error, check server logs');
  }
}
