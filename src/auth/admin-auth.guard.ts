import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ContactsService } from '../contact/contact.service';
import { ADMIN_USER_LEVEL } from '../auth/auth.constant';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly contactsService: ContactsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user_level, user_id } = request.user;

    if (user_level === ADMIN_USER_LEVEL) {
      request.user_level = ADMIN_USER_LEVEL;
      request.user_id = '';
      return true; // Admin user has permission, allow access
    }

    // Regular user, check if they have permission to edit the contact
    const contactId = request.params.id_contacts; // Assuming the contact ID is passed as a route parameter
    const contact = await this.contactsService.getContactsById(
      contactId,
      user_id,
      user_level,
    );

    if (contact.data.length == 0) {
      return false; // Contact does not exist, deny access
    }

    return true; // Regular user does not have permission, deny access
  }
}
