import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ContactsService } from '../contact/contact.service';
import { ADMIN_USER_LEVEL } from '../auth/auth.constant';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);
  constructor(private readonly contactsService: ContactsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user_level, user_id, ...resRequest } = request.user;

    this.logger.debug('Checking admin permissions');
    if (user_level == ADMIN_USER_LEVEL) {
      this.logger.debug('Admin user detected. Granting access.');

      if (request.body.user_id === undefined && request.route.methods.post) {
        this.logger.debug('Admin user_id is null. Access denied.');
        return false;
      }
      request['user'] = resRequest;
      return true;
    } else {
      if (!request.route.methods.get) {
        request.body.user_id = user_id;
      }

      this.logger.debug(
        'Regular user detected. Access granted for non-edit request.',
      );

      const contactId = request.params.id_contacts;
      const contact = await this.contactsService.getContactsById(
        contactId,
        user_id,
      );
      if (contact.data.length == 0) {
        this.logger.debug('Contact not found. Access denied.');
        return false;
      } else {
        this.logger.debug('Contact permission granted.');
        return true;
      }
    }
  }
}
