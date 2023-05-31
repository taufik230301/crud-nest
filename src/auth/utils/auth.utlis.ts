import { Logger } from '@nestjs/common';
import { ContactsService } from 'src/contact/contact.service';
import { jwtConstants } from '../auth.constant';
import { JwtService } from '@nestjs/jwt';

export class AuthUtils {
  private static readonly logger = new Logger(AuthUtils.name);

  public static handleAuthenticationResult(result: any, username: string) {
    const response = {
      message: '',
      statusCode: result.statusCode,
      access_token: result.access_token,
    };

    switch (result.statusCode) {
      case 200:
        this.logger.log(`User '${username}' successfully logged in`);
        response.message = 'Success Login';
        break;
      case 401:
        response.message = `Cannot login, password doesn't match`;
        break;
      case 404:
        response.message = `Cannot login, user '${username}' not exists`;
        break;
      default:
        response.message = 'Error occurred.';
        break;
    }

    return response;
  }

  public static handleRegistrationResult(result: any, username: string) {
    const response = {
      message: '',
      statusCode: result.statusCode,
      data: result.data,
    };

    if (result.statusCode === 200) {
      this.logger.log(`User '${username}' registered successfully.`);
      response.message = 'Register Successfully';
    } else {
      this.logger.log(`Failed to register user '${username}'.`);
      response.message = 'Register Error';
    }

    return response;
  }
  public static async checkContactAdminPermission(
    request: any,
    resRequest: any,
  ) {
    this.logger.debug('Admin user detected. Granting access.');

    if (request.body.user_id === undefined && request.route.methods.post) {
      this.logger.debug('Admin user_id is null. Access denied.');
      return false;
    }
    request['user'] = resRequest;
    return true;
  }

  public static async checkContactPermission(
    request: any,
    user_id: number,
    contactsService: ContactsService,
  ): Promise<boolean> {
    if (request.route.methods.post) {
      request.body.user_id = user_id;
    }

    const contactId = request.params.id_contacts;
    const contact = await contactsService.getContactsById(contactId, user_id);

    if (contact.data.length == 0) {
      this.logger.debug('Contact not found. Access denied.');
      return false;
    } else {
      this.logger.debug('Contact permission granted.');
      return true;
    }
  }

  public static async getTokens(user: any, jwtService: JwtService) {
    const payload = {
      user_level: user.data.user_level,
      user_id: user.data.user_id,
    };
    this.logger.log('creating token...');
    const token: string = await jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1800s',
    });
    this.logger.log('token created');
    return {
      statusCode: 200,
      access_token: token,
    };
  }
}
