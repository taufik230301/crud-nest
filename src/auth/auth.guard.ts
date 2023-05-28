import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constant';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  private readonly logger = new Logger(AuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    this.logger.debug('Extracted request object from execution context');
    const token = this.extractTokenFromHeader(request);
    this.logger.debug('Extracted token from the request header');
    if (!token) {
      this.logger.warn('Authorization token not provided');
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      this.logger.debug('Token verified successfully');
      request['user'] = payload;
      this.logger.debug('Assigned payload to the request object');
    } catch {
      this.logger.warn('Invalid authorization token');
      throw new UnauthorizedException();
    }
    this.logger.debug('User is authorized');
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    this.logger.debug('Extracted token from the Authorization header');
    return type === 'Bearer' ? token : undefined;
  }
}
