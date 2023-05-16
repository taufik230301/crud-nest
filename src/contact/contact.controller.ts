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
} from '@nestjs/common';
import { ContactsService } from './contact.service';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateContactsDto from './dto/createContacts.dto';
import UpdateContactsDto from './dto/updateContacts.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getContacts(
    @Req() request: any,
    @Query('account_number') account_number: string,
    @Query('bank_name') bank_name: string,
    @Query('contacts_name') contacts_name: string,
  ) {
    const contact = await this.contactsService.getAllContacts(
      request.user.user_id,
      account_number,
      bank_name,
      contacts_name,
    );

    if (contact) {
      return contact;
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({}))
  async createContacts(
    @Body() contacts: CreateContactsDto,
    @Req() request: any,
  ) {
    const contact = await this.contactsService.createContacts(
      contacts,
      request.user.user_id,
    );

    if (contact) {
      return contact;
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id_contacts')
  @UsePipes(new ValidationPipe({}))
  async updateContacts(
    @Param('id_contacts') id_contacts: string,
    @Body() contacts: UpdateContactsDto,
    @Req() request,
  ) {
    const contact = await this.contactsService.updateContacts(
      String(id_contacts),
      contacts,
      request.user.user_id,
    );
    if (contact) {
      return contact;
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id_contacts')
  async deleteContact(
    @Param('id_contacts') id_contacts: string,
    @Req() request,
  ) {
    const contact = await this.contactsService.deleteContact(
      String(id_contacts),
      request.user.user_id,
    );
    if (contact) {
      return contact;
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id_contacts')
  async getContactById(
    @Param('id_contacts') id_contacts: string,
    @Req() request: any,
  ) {
    const contact = await this.contactsService.getContactsById(
      String(id_contacts),
      request.user.user_id,
    );

    if (contact) {
      return contact;
    }
  }
}
