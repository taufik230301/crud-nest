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
import { AuthUtils } from '../auth/utils/auth.utlis';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: false }))
  async signIn(@Body() userData: LoginUsersDto) {
    try {
      this.logger.verbose(
        `Received login request for username: ${userData.username}`,
      );
      this.logger.log('signIn function called.');
      const result = await this.authService.signIn(
        userData.username,
        userData.password,
      );

      return AuthUtils.handleAuthenticationResult(result, userData.username);
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

      return AuthUtils.handleRegistrationResult(result, userData.username);
    } catch (err) {
      this.logger.error('An error occurred during user registration:', err);
      return {
        message: err,
        statusCode: 500,
        access_token: 'null',
      };
    }
  }
}
