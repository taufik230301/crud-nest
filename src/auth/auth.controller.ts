import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginUsersDto } from '../user/dto/loginUsers.dto';
import CreateUsersDto from 'src/user/dto/createUsers.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: false }))
  async signIn(@Body() users: LoginUsersDto) {
    try {
      this.logger.log(`Received login request for username: ${users.username}`);
      this.logger.log('signIn function called.');
      const result = await this.authService.signIn(
        users.username,
        users.password,
      );

      if (result.statusCode == 200) {
        this.logger.log(`User '${users.username}' successfully logged in`);
        return {
          message: `Success Login`,
          statusCode: result.statusCode,
          access_token: result.access_token,
        };
      } else if (result.statusCode == 401) {
        return {
          message: `Cannot login, password doesn't match`,
          statusCode: result.statusCode,
        };
      } else if (result.statusCode == 404) {
        return {
          message: `Cannot login, user '${users.username}' not exists`,
          statusCode: result.statusCode,
        };
      } else {
        return {
          message: 'Error occurred.',
          statusCode: result.statusCode,
        };
      }
    } catch (err) {
      this.logger.error(
        `Error occurred during login for username: ${users.username}`,
        err,
      );
      return {
        message: `Error occurred during login for username: ${users.username}`,
        statusCode: 500,
        data: err,
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: false }))
  async signUp(@Body() userData: CreateUsersDto) {
    try {
      this.logger.log(`Registering user '${userData.username}'...`);
      const result = await this.authService.signUp(userData);

      if (result.statusCode == 200) {
        this.logger.log(`User '${userData.username}' registered successfully.`);
        return {
          message: 'Register Successfully',
          statusCode: 200,
        };
      } else {
        this.logger.log(`Failed to register user '${userData.username}'.`);
        return {
          message: 'Register Error',
          statusCode: result.statusCode,
          data: result.data,
        };
      }
    } catch (error) {
      this.logger.log('An error occurred during user registration:', error);
      return {
        message: 'Register Error',
        statusCode: 500,
        data: error,
      };
    }
  }
}
