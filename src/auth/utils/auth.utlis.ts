import { Logger } from '@nestjs/common';

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
}
