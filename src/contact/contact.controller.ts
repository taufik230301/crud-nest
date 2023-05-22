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

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  private readonly logger = new Logger(ContactsController.name);
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
        account_number,
        bank_name,
        contacts_name,
      );

      if (contact.status == 200) {
        this.logger.log('Successfully retrieved data.');
        return {
          message: 'Succesfully Get Data',
          statusCode: contact.status,
          data: contact.data,
        };
      } else if (contact.status == 204) {
        this.logger.log('Successfully retrieved data but no data found.');
        return {
          message: 'Succesfully But Get No Data',
          statusCode: contact.status,
          data: contact.data,
        };
      } else if (contact.status == 500) {
        this.logger.log('Error retrieving data.');
        return {
          message: 'Error Get Data',
          statusCode: contact.status,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: 'Error Get Data',
        statusCode: 500,
        data: err,
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

      const contact_data = { ...contacts, user_id };
      this.logger.log('Creating contact:', contact_data);

      this.logger.log('createContacts function called.');
      const contact = await this.contactsService.createContacts(contact_data);

      if (contact.status == 200) {
        this.logger.log('Successfully created data.');
        return {
          message: 'Succesfully Create Data',
          status: contact.status,
          data: contact.data,
        };
      } else {
        this.logger.log('Successfully created data.');
        return {
          message: 'Error Create Data',
          status: contact.status,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: 'Error Create Data',
        status: 500,
        data: err,
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
    @Req() request,
  ) {
    try {
      this.logger.log('updateContacts function called.');
      const contact = await this.contactsService.updateContacts(
        String(id_contacts),
        contacts,
        request.user.user_id,
      );

      if (contact.status == 200) {
        this.logger.log('Successfully updated data.');
        return {
          message: 'Succesfully Update Data',
          statusCode: contact.status,
          data: contact.data,
        };
      } else if (contact.status == 404) {
        this.logger.log('Error updating data. Data not found.');
        return {
          message: 'Error Update Data',
          statusCode: contact.status,
          data: contact.data,
        };
      } else if (contact.status == 204) {
        this.logger.log('Error updating data. Data does not exist.');
        return {
          message: 'Error Update Data Doesnt Exist',
          statusCode: contact.status,
          data: contact.data,
        };
      } else if (contact.status == 403) {
        this.logger.log('Error updating data. Permission denied.');
        return {
          message: 'Error Update Data, Permission Denied',
          statusCode: contact.status,
          data: contact.data,
        };
      } else if (contact.status == 500) {
        this.logger.log('Error updating data. Server error.');
        return {
          message: 'Error Update Data',
          statusCode: contact.status,
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: 'Error Update Data',
        statusCode: 500,
        data: err,
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
      );
      if (contact.status == 200) {
        this.logger.log('Successfully deleted data.');
        return {
          message: 'Succesfully Delete Data',
          statusCode: '200',
          data: contact.data,
        };
      } else if (contact.status == 404) {
        this.logger.log('Error deleting data. Data not found.');
        return {
          message: 'Error Delete Data',
          statusCode: '500',
          data: contact.data,
        };
      } else if (contact.status == 403) {
        this.logger.log('Error deleting data. Permission denied.');
        return {
          message: 'Error Delete Data, Permission Denied',
          statusCode: '500',
          data: contact.data,
        };
      } else if (contact.status == 204) {
        this.logger.log('Error deleting data. Data does not exist.');
        return {
          message: 'Error Delete Data, Data Doesnt Exist',
          statusCode: '500',
          data: contact.data,
        };
      } else if (contact.status == 500) {
        this.logger.log('Error deleting data. Server error.');
        return {
          message: 'Error When Delete Data',
          statusCode: '500',
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: 'Error When Delete Data',
        statusCode: '500',
        data: err,
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
      );

      if (contact.status == 200) {
        this.logger.log('Successfully retrieved data.');
        return {
          message: 'Succesfully Get Data',
          statusCode: '200',
          data: contact.data,
        };
      } else if (contact.status == 204) {
        this.logger.log('Data not found.');
        return {
          message: 'Succesfully But Get No Data',
          statusCode: '500',
          data: contact.data,
        };
      } else if (contact.status == 403) {
        this.logger.log('Error getting data. Permission denied.');
        return {
          message: 'Error Get Data, Permission Denied',
          statusCode: '500',
          data: contact.data,
        };
      } else if (contact.status == 500) {
        this.logger.log('Error getting data. Server error.');
        return {
          message: 'Error When Get Data',
          statusCode: '500',
          data: contact.data,
        };
      }
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return {
        message: 'Error When Get Data',
        statusCode: '500',
        data: err,
      };
    }
  }
}
