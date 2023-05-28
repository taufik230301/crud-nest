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
  async signIn(@Body() userData: LoginUsersDto) {
    try {
      this.logger.log(
        `Received login request for username: ${userData.username}`,
      );
      this.logger.log('signIn function called.');
      const result = await this.authService.signIn(
        userData.username,
        userData.password,
      );

      return this.handleAuthenticationResult(result, userData.username);
    } catch (err) {
      this.logger.error(
        `Error occurred during login for username: ${userData.username}`,
        err,
      );
      return {
        message: err,
        statusCode: 500,
        access_token: 'null',
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

      return this.handleRegistrationResult(result, userData.username);
    } catch (err) {
      this.logger.log('An error occurred during user registration:', err);
      return {
        message: err,
        statusCode: 500,
        access_token: 'null',
      };
    }
  }

  private handleAuthenticationResult(result: any, username: string) {
    const response = {
      message: '',
      statusCode: result.statusCode,
      access_token: result.access_token,
    };

    switch (result.statusCode) {
      case 200:
        this.logger.log(`User '${username}' successfully logged in`);
        response.message = 'Success Login';
        break;
      case 401:
        response.message = `Cannot login, password doesn't match`;
        break;
      case 404:
        response.message = `Cannot login, user '${username}' not exists`;
        break;
      default:
        response.message = 'Error occurred.';
        break;
    }

    return response;
  }

  private handleRegistrationResult(result: any, username: string) {
    const response = {
      message: '',
      statusCode: result.statusCode,
      data: result.data,
    };

    if (result.statusCode === 200) {
      this.logger.log(`User '${username}' registered successfully.`);
      response.message = 'Register Successfully';
    } else {
      this.logger.log(`Failed to register user '${username}'.`);
      response.message = 'Register Error';
    }

    return response;
  }
}
