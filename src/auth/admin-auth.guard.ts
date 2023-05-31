import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ContactsService } from '../contact/contact.service';
import { ADMIN_USER_LEVEL } from '../auth/auth.constant';
import { AuthUtils } from './utils/auth.utlis';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);
  constructor(private readonly contactsService: ContactsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user_level, user_id, ...resRequest } = request.user;

    this.logger.debug('Checking admin permissions');
    if (user_level == ADMIN_USER_LEVEL) {
      return AuthUtils.checkContactAdminPermission(request, resRequest);
    } else {
      return AuthUtils.checkContactPermission(
        request,
        user_id,
        this.contactsService,
      );
    }
  }
}
