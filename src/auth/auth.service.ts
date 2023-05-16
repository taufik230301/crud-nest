import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      if (user.password == password) {
        const payload = { user_level: user.user_level, user_id: user.user_id };
        return {
          message: 'Success',
          statusCode: '200',
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
