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
    try {
      const user = await this.userService.getUserByUsername(username);
      this.logger.log(`checking user '${username}' ...`);

      if (user.status == 200) {
        this.logger.log(`user '${username}' exists`);
        this.logger.log('checking password....');
        if (user.data.password == password) {
          this.logger.log('password match');
          const payload = {
            user_level: user.data.user_level,
            user_id: user.data.user_id,
          };
          this.logger.log('creating token...');
          const token: string = await this.jwtService.signAsync(payload);
          this.logger.log('token created');
          return {
            statusCode: 200,
            access_token: token,
          };
        } else {
          this.logger.log('password not match');
          return {
            statusCode: 401,
          };
        }
      } else {
        this.logger.log(`user '${username}' not exists`);
        return {
          statusCode: 404,
        };
      }
    } catch (error) {
      this.logger.log(`Error occurred`);
      return {
        statusCode: 500,
        data: error,
      };
    }
  }
}
