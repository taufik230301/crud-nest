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
import { ADMIN_USER_LEVEL } from './contact.constant';

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
        return {
          message: 'Succesfully Get Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 204) {
        this.logger.log('Successfully retrieved data but no data found.');
        return {
          message: 'Succesfully But Get No Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 500) {
        this.logger.log('Error retrieving data.');
        return {
          message: 'Error Get Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: err,
        statusCode: 500,
        data: 'null',
      };
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({}))
  async createContacts(
    @Body() contacts: CreateContactsDto,
    @Req() request: any,
  ) {
    try {
      this.logger.log('Extracting user_id from request:', request.user);
      const { user_id } = request.user;

      this.logger.log('Checking if permisions is admin');
      if (request.user.user_level == ADMIN_USER_LEVEL) {
        this.logger.log('Checking if user_id is null');
        if (contacts.user_id) {
          this.contact_data = contacts;
          this.logger.log('Creating contact:', this.contact_data);
        } else {
          this.logger.log('An error occurred: user_id cannot be null');
          return {
            message: 'Error Create Data, user_id cannot be null',
            statusCode: 500,
            data: [],
          };
        }
      } else {
        this.contact_data = { ...contacts, user_id };
        this.logger.log('Creating contact:', this.contact_data);
      }

      this.logger.log('createContacts function called.');
      const contact = await this.contactsService.createContacts(
        this.contact_data,
      );

      if (contact.statusCode == 200) {
        this.logger.log('Successfully created data.');
        return {
          message: 'Succesfully Create Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else {
        this.logger.log('Successfully created data.');
        return {
          message: 'Error Create Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: err,
        statusCode: 500,
        data: 'null',
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id_contacts')
  @UsePipes(new ValidationPipe({}))
  async updateContacts(
    @Param('id_contacts')
    id_contacts: string,
    @Body() contacts: UpdateContactsDto,
    @Req() request: any,
  ) {
    try {
      this.logger.log('updateContacts function called.');
      const contact = await this.contactsService.updateContacts(
        String(id_contacts),
        contacts,
        request.user.user_id,
        request.user.user_level,
      );

      if (contact.statusCode == 200) {
        this.logger.log('Successfully updated data.');
        return {
          message: 'Succesfully Update Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 404) {
        this.logger.log('Error updating data. Data not found.');
        return {
          message: 'Error Update Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 204) {
        this.logger.log('Error updating data. Data does not exist.');
        return {
          message: 'Error Update Data Doesnt Exist',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 403) {
        this.logger.log('Error updating data. Permission denied.');
        return {
          message: 'Error Update Data, Permission Denied',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 500) {
        this.logger.log('Error updating data. Server error.');
        return {
          message: 'Error Update Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: err,
        statusCode: 500,
        data: 'null',
      };
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id_contacts')
  async deleteContact(
    @Param('id_contacts') id_contacts: string,
    @Req() request,
  ) {
    try {
      this.logger.log('deleteContact function called.');
      const contact = await this.contactsService.deleteContact(
        String(id_contacts),
        request.user.user_id,
        request.user.user_level,
      );
      if (contact.statusCode == 200) {
        this.logger.log('Successfully deleted data.');
        return {
          message: 'Succesfully Delete Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 404) {
        this.logger.log('Error deleting data. Data not found.');
        return {
          message: 'Error Delete Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 403) {
        this.logger.log('Error deleting data. Permission denied.');
        return {
          message: 'Error Delete Data, Permission Denied',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 204) {
        this.logger.log('Error deleting data. Data does not exist.');
        return {
          message: 'Error Delete Data, Data Doesnt Exist',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 500) {
        this.logger.log('Error deleting data. Server error.');
        return {
          message: 'Error When Delete Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: err,
        statusCode: 500,
        data: 'null',
      };
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
        return {
          message: 'Succesfully Get Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 204) {
        this.logger.log('Data not found.');
        return {
          message: 'Succesfully But Get No Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 403) {
        this.logger.log('Error getting data. Permission denied.');
        return {
          message: 'Error Get Data, Permission Denied',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      } else if (contact.statusCode == 500) {
        this.logger.log('Error getting data. Server error.');
        return {
          message: 'Error When Get Data',
          statusCode: contact.statusCode,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: err,
        statusCode: 500,
        data: 'null',
      };
    }
  }
}
