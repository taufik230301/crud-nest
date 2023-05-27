import { Repository } from 'typeorm';
import Users from './entity/users.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUsersDto from './dto/createUsers.dto';

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
          statusCode: 200,
        };
      } else {
        return {
          data: user,
          statusCode: 500,
        };
      }
    } catch (error) {
      this.logger.log(`Error occurred`);
      return {
        data: error,
        statusCode: 500,
      };
    }
  }

  async createUser(userData: CreateUsersDto) {
    try {
      this.logger.log(`Run Query for insert user '${userData.username}' ...`);
      const createdUser = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values(userData)
        .execute();

      if (createdUser) {
        this.logger.log(`User '${userData.username}' created successfully.`);
        return {
          statusCode: 200,
        };
      } else {
        this.logger.log('Failed to create user.', createdUser);
        return {
          data: createdUser,
          statusCode: 500,
        };
      }
    } catch (error) {
      this.logger.log('Error occurred while creating user.', error);
      return {
        data: error,
        statusCode: 500,
      };
    }
  }
}
