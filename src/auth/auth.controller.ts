import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginUsersDto } from '../user/dto/loginUsers.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: false }))
  async signIn(@Body() users: LoginUsersDto) {
    return this.authService.signIn(users.username, users.password);
  }
}
