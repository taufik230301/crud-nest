import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  Logger,
} from '@nestjs/common';
import { ContactsService } from './contact.service';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateContactsDto from './dto/createContacts.dto';
import UpdateContactsDto from './dto/updateContacts.dto';
import { ErrorResponse, SuccessResponse } from './utils/contact.utils';
import { CheckAdminPermissions } from 'src/auth/decorator/admin-permission.decorator';
import { AdminGuard } from 'src/auth/admin-auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  private readonly logger = new Logger(ContactsController.name);
  contact_data: any;
  @UseGuards(AuthGuard)
  @Get()
  async getContacts(
    @Req() request: any,
    @Query('account_number') account_number: string,
    @Query('bank_name') bank_name: string,
    @Query('contacts_name') contacts_name: string,
  ) {
    try {
      this.logger.log('getContacts function called.');
      const contact = await this.contactsService.getAllContacts(
        request.user.user_id,
        request.user.user_level,
        account_number,
        bank_name,
        contacts_name,
      );

      if (contact.statusCode == 200) {
        this.logger.log('Successfully retrieved data.');
        return SuccessResponse(
          'Succesfully Get Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 204) {
        this.logger.log('Successfully retrieved data but no data found.');
        return SuccessResponse(
          'Succesfully But Get No Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 500) {
        this.logger.log('Error retrieving data.');
        return ErrorResponse(
          'Error Get Data',
          contact.statusCode,
          contact.data,
        );
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ErrorResponse(err, 500, 'null');
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({}))
  async createContacts(@CheckAdminPermissions('user') request: any) {
    try {
      this.logger.log('createContacts function called.');
      const user_id = request.contactData.user_id;

      if (!user_id) {
        this.logger.log('An error occurred: user_id cannot be null');
        return ErrorResponse(
          'Error Create Data, user_id cannot be null',
          404,
          'null',
        );
      }

      const contactData: CreateContactsDto = { ...request.body, user_id };
      const contact = await this.contactsService.createContacts(contactData);

      if (contact.statusCode == 200) {
        this.logger.log('Successfully created data.');
        return SuccessResponse(
          'Succesfully Create Data',
          contact.statusCode,
          contact.data,
        );
      } else {
        this.logger.log('Error Create Data.');
        return ErrorResponse(
          'Error Create Data',
          contact.statusCode,
          contact.data,
        );
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ErrorResponse(err, 500, 'null');
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id_contacts')
  @UsePipes(new ValidationPipe({}))
  async updateContacts(
    @Param('id_contacts')
    id_contacts: string,
    @Body() contacts: UpdateContactsDto,
  ) {
    try {
      this.logger.log('updateContacts function called.');
      const contact = await this.contactsService.updateContacts(
        String(id_contacts),
        contacts,
      );

      if (contact.statusCode == 200) {
        this.logger.log('Successfully updated data.');
        return SuccessResponse(
          'Succesfully Update Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 404) {
        this.logger.log('Error updating data. Data not found.');
        return ErrorResponse(
          'Error Update Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 204) {
        this.logger.log('Error updating data. Data does not exist.');
        return ErrorResponse(
          'Error Update Data Doesnt Exist',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 403) {
        this.logger.log('Error updating data. Permission denied.');
        return ErrorResponse(
          'Error Update Data, Permission Denied',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 500) {
        this.logger.log('Error updating data. Server error.');
        return ErrorResponse(
          'Error Update Data',
          contact.statusCode,
          contact.data,
        );
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ErrorResponse(err, 500, 'null');
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id_contacts')
  async deleteContact(@Param('id_contacts') id_contacts: string) {
    try {
      this.logger.log('deleteContact function called.');
      const contact = await this.contactsService.deleteContact(
        String(id_contacts),
      );
      if (contact.statusCode == 200) {
        this.logger.log('Successfully deleted data.');
        return SuccessResponse(
          'Succesfully Delete Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 404) {
        this.logger.log('Error deleting data. Data not found.');
        return ErrorResponse(
          'Error Delete Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 403) {
        this.logger.log('Error deleting data. Permission denied.');
        return ErrorResponse(
          'Error Delete Data, Permission Denied',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 204) {
        this.logger.log('Error deleting data. Data does not exist.');
        return ErrorResponse(
          'Error Delete Data, Data Doesnt Exist',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 500) {
        this.logger.log('Error deleting data. Server error.');
        return ErrorResponse(
          'Error When Delete Data',
          contact.statusCode,
          contact.data,
        );
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ErrorResponse(err, 500, 'null');
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id_contacts')
  async getContactById(
    @Param('id_contacts') id_contacts: string,
    @Req() request: any,
  ) {
    try {
      this.logger.log('getContactById function called.');
      const contact = await this.contactsService.getContactsById(
        String(id_contacts),
        request.user.user_id,
        request.user.user_level,
      );

      if (contact.statusCode == 200) {
        this.logger.log('Successfully retrieved data.');
        return SuccessResponse(
          'Succesfully Get Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 204) {
        this.logger.log('Data not found.');
        return SuccessResponse(
          'Succesfully But Get No Data',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 403) {
        this.logger.log('Error getting data. Permission denied.');
        return ErrorResponse(
          'Error Get Data, Permission Denied',
          contact.statusCode,
          contact.data,
        );
      } else if (contact.statusCode == 500) {
        this.logger.log('Error getting data. Server error.');
        return ErrorResponse(
          'Error When Get Data',
          contact.statusCode,
          contact.data,
        );
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ErrorResponse(err, 500, 'null');
    }
  }
}
