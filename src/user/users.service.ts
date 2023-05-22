import { Repository } from 'typeorm';
import Users from './entity/users.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async getUserByUsername(username: string) {
    try {
      this.logger.log(`Run Query for checking user '${username}' ...`);
      const user = await this.usersRepository.findOneBy({ username: username });
      if (user) {
        return {
          data: user,
          status: 200,
        };
      } else {
        return {
          data: user,
          status: 500,
        };
      }
    } catch (error) {
      this.logger.log(`Error occurred`);
      return {
        data: error,
        status: 500,
      };
    }
  }
}
