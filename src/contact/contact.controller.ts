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
import { IsString } from 'class-validator';
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

    if (contact.status == 200) {
      return {
        message: 'Succesfully Get Data',
        statusCode: contact.status,
        data: contact.data,
      };
    } else if (contact.status == 204) {
      return {
        message: 'Succesfully But Get No Data',
        statusCode: contact.status,
        data: contact.data,
      };
    } else if (contact.status == 500) {
      return {
        message: 'Error Get Data',
        statusCode: contact.status,
        data: contact.data,
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
    const { user_id } = request.user;
    const contact_data = { ...contacts, user_id };
    const contact = await this.contactsService.createContacts(contact_data);

    if (contact.status == 200) {
      return {
        message: 'Succesfully Create Data',
        status: contact.status,
        data: contact.data,
      };
    } else {
      return {
        message: 'Error Create Data',
        status: contact.status,
        data: contact.data,
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
    const contact = await this.contactsService.updateContacts(
      String(id_contacts),
      contacts,
      request.user.user_id,
    );

    if (contact.status == 200) {
      return {
        message: 'Succesfully Update Data',
        statusCode: contact.status,
        data: contact.data,
      };
    } else if (contact.status == 404) {
      return {
        message: 'Error Update Data',
        statusCode: contact.status,
        data: contact.data,
      };
    } else if (contact.status == 204) {
      return {
        message: 'Error Update Data Doesnt Exist',
        statusCode: contact.status,
        data: contact.data,
      };
    } else if (contact.status == 403) {
      return {
        message: 'Error Update Data, Permission Denied',
        statusCode: contact.status,
        data: contact.data,
      };
    } else if (contact.status == 500) {
      return {
        message: 'Error Update Data',
        statusCode: contact.status,
        data: contact.data,
      };
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
    if (contact.status == 200) {
      return {
        message: 'Succesfully Delete Data',
        statusCode: '200',
        data: contact.data,
      };
    } else if (contact.status == 404) {
      return {
        message: 'Error Delete Data',
        statusCode: '500',
        data: contact.data,
      };
    } else if (contact.status == 403) {
      return {
        message: 'Error Delete Data, Permission Denied',
        statusCode: '500',
        data: contact.data,
      };
    } else if (contact.status == 204) {
      return {
        message: 'Error Delete Data, Data Doesnt Exist',
        statusCode: '500',
        data: contact.data,
      };
    } else if (contact.status == 500) {
      return {
        message: 'Error When Delete Data',
        statusCode: '500',
        data: contact.data,
      };
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

    if (contact.status == 200) {
      return {
        message: 'Succesfully Get Data',
        statusCode: '200',
        data: contact.data,
      };
    } else if (contact.status == 204) {
      return {
        message: 'Succesfully But Get No Data',
        statusCode: '500',
        data: contact.data,
      };
    } else if (contact.status == 403) {
      return {
        message: 'Error Get Data, Permission Denied',
        statusCode: '500',
        data: contact.data,
      };
    } else if (contact.status == 500) {
      return {
        message: 'Error When Get Data',
        statusCode: '500',
        data: contact.data,
      };
    }
  }
}
