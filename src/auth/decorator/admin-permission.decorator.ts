import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { ADMIN_USER_LEVEL } from '../../contact/contact.constant';

export const CheckAdminPermissions = createParamDecorator(
  (user: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user_level } = request[user];

    if (user_level != ADMIN_USER_LEVEL) {
      const { user_id } = request.user;
      const contactData = { user_id };
      request.contactData = contactData;
    } else {
      const { user_id } = request.body;
      const contactData = { user_id };
      request.contactData = contactData;
    }

    return request;
  },
);
