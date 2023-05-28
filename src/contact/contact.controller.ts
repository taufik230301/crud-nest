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
import { ContactUtils } from './utils/contact.utils';
import { AdminGuard } from 'src/auth/admin-auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  private readonly logger = new Logger(ContactsController.name);
  contact_data: any;
  @UseGuards(AuthGuard, AdminGuard)
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

      return ContactUtils.handleContactResponse(
        contact.statusCode,
        'Successfully retrieved data.',
        'Error retrieved data. Data not found',
        contact.data,
      );
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ContactUtils.ErrorResponse(err, 500, 'null');
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  @UsePipes(new ValidationPipe({}))
  async createContacts(@Body() contactData: CreateContactsDto) {
    try {
      this.logger.log('createContacts function called.');

      const contact = await this.contactsService.createContacts(contactData);

      return ContactUtils.handleContactResponse(
        contact.statusCode,
        'Successfully created data.',
        'Error creating data.',
        contact.data,
      );
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ContactUtils.ErrorResponse(err, 500, 'null');
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

      return ContactUtils.handleContactResponse(
        contact.statusCode,
        'Successfully update data.',
        'Error updating data. Data not found',
        contact.data,
      );
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ContactUtils.ErrorResponse(err, 500, 'null');
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
      return ContactUtils.handleContactResponse(
        contact.statusCode,
        'Successfully deleted data.',
        'Error deleted data. Data not found',
        contact.data,
      );
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ContactUtils.ErrorResponse(err, 500, 'null');
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
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

      return ContactUtils.handleContactResponse(
        contact.statusCode,
        'Successfully get data.',
        'Error get data. Data not found',
        contact.data,
      );
    } catch (err) {
      this.logger.log('An error occurred:', err);
      return ContactUtils.ErrorResponse(err, 500, 'null');
    }
  }
}
