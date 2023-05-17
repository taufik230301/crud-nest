import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    this.logger.log(`checking user '${username}' ...`);

    if (user) {
      this.logger.log(`user '${username}' exists`);
      this.logger.log('checking password....');
      if (user.password == password) {
        this.logger.log('password match');
        const payload = { user_level: user.user_level, user_id: user.user_id };
        this.logger.log('creating token...');
        const token: string = await this.jwtService.signAsync(payload);
        this.logger.log('token created');
        return {
          message: 'Success',
          statusCode: '200',
          access_token: token,
        };
      } else {
        this.logger.log('password not match');
        throw new UnauthorizedException();
      }
    } else {
      this.logger.log(`user '${username}' not exists`);
      throw new UnauthorizedException();
    }
  }
}
