import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginUsersDto } from '../user/dto/loginUsers.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: false }))
  async signIn(@Body() users: LoginUsersDto, @Res() response: any) {
    try {
      this.logger.log(`Received login request for username: ${users.username}`);
      const result = await this.authService.signIn(
        users.username,
        users.password,
      );
      this.logger.log(`User '${users.username}' successfully logged in`);
      return response.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error(
        `Error occurred during login for username: ${users.username}`,
        err,
      );
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred during login' });
    }
  }
}
