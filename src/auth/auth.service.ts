import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import CreateUsersDto from 'src/user/dto/createUsers.dto';
import { jwtConstants } from './auth.constant';
import { AuthUtils } from './utils/auth.utlis';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async signIn(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getUserByUsername(username);
      this.logger.log(`checking user '${username}' ...`);

      if (user.data) {
        this.logger.log(`user '${username}' exists`);
        this.logger.log('checking password....');
        const PasswordMatch = await bcrypt.compare(
          password,
          user.data.password,
        );
        if (PasswordMatch) {
          this.logger.log('password match');
          return AuthUtils.getTokens(user, this.jwtService);
        } else {
          this.logger.log('password not match');
          return {
            statusCode: 401,
            access_token: 'null',
          };
        }
      } else {
        this.logger.log(`user '${username}' not exists`);
        return {
          statusCode: 404,
          access_token: 'null',
        };
      }
    } catch (error) {
      this.logger.error(`Error occurred`);
      return {
        statusCode: 500,
        access_token: 'null',
      };
    }
  }

  async signUp(userData: CreateUsersDto) {
    try {
      this.logger.log(
        `Starting password hashing for user '${userData.username}'...`,
      );
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userData.password, salt);
      userData.password = hash;
      this.logger.log(
        `Password hashing completed for user '${userData.username}'.`,
      );

      this.logger.log(`Creating user '${userData.username}'...`);
      const user = await this.userService.createUser(userData);
      this.logger.log(`User '${userData.username}' created successfully.`);

      if (user.data) {
        return {
          data: user.data,
          statusCode: user.statusCode,
        };
      } else {
        return {
          data: user.data,
          statusCode: user.statusCode,
        };
      }
    } catch (error) {
      this.logger.error('An error occurred during sign up:', error);
      return {
        data: error,
        statusCode: 500,
      };
    }
  }
}
