import { Repository } from 'typeorm';
import Users from './entity/users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getUserByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username: username });
    if (user) {
      return user;
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
