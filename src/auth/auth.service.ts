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
    console.log(`checking user '${username}' ...`);

    if (user) {
      console.log(`user '${username}' exists`);
      console.log('checking password....');
      if (user.password == password) {
        console.log('password match');
        const payload = { user_level: user.user_level, user_id: user.user_id };
        console.log('creating token...');
        const token: string = await this.jwtService.signAsync(payload);
        console.log('token created');
        return {
          message: 'Success',
          statusCode: '200',
          access_token: token,
        };
      } else {
        console.log('password not match');
        throw new UnauthorizedException();
      }
    } else {
      console.log(`user '${username}' not exists`);
      throw new UnauthorizedException();
    }
  }
}
