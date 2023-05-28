import { FindManyOptions, QueryRunner } from 'typeorm';
import CreateContactsDto from '../dto/createContacts.dto';
import UpdateContactsDto from '../dto/updateContacts.dto';
import Contacts from '../entity/contact.entity';
import { ADMIN_USER_LEVEL } from '../../auth/auth.constant';
import { Logger } from '@nestjs/common';

export class ContactUtils {
  private static readonly logger = new Logger(ContactUtils.name);

  public static async createContactInDatabase(
    queryRunner: QueryRunner,
    contacts: CreateContactsDto,
  ) {
    const newContacts = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Contacts)
      .values(contacts)
      .execute();

    return newContacts;
  }

  public static async readContactInDatabase(
    queryRunner: QueryRunner,
    options: FindManyOptions<Contacts>,
  ) {
    const newContacts = await queryRunner.manager.find(Contacts, options);

    return newContacts;
  }

  public static async deleteContactInDatabase(
    queryRunner: QueryRunner,
    id_contacts: string,
  ) {
    const deleted = await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Contacts)
      .where('id_contacts = :id', { id: id_contacts })
      .execute();

    return deleted;
  }

  public static async updateContactInDatabase(
    queryRunner: QueryRunner,
    contacts: UpdateContactsDto,
    id_contacts: string,
  ) {
    const updated_contact = await queryRunner.manager
      .createQueryBuilder()
      .update(Contacts)
      .set(contacts)
      .where('id_contacts = :id', { id: id_contacts })
      .execute();

    return updated_contact;
  }

  public static async SuccessResponse(
    message: string,
    statusCode: number,
    data: any,
  ) {
    return {
      message: message,
      statusCode: statusCode,
      data: data,
    };
  }

  public static async ErrorResponse(
    message: string,
    statusCode: number,
    data: any,
  ) {
    return {
      message: message,
      statusCode: statusCode,
      data: data,
    };
  }

  public static async handleContactResponse(
    statusCode: number,
    successMessage: string,
    errorMessage: string,
    data: any,
  ) {
    const response =
      statusCode === 200
        ? this.SuccessResponse(successMessage, statusCode, data)
        : this.ErrorResponse(errorMessage, statusCode, data);

    this.logger.log(response);
    return response;
  }

  public static async createWhereOptions(
    user_level: number,
    user_id: number,
    account_number: string,
    bank_name: string,
    contacts_name: string,
  ) {
    if (user_level == ADMIN_USER_LEVEL) {
      return {
        account_number: account_number,
        bank_name: bank_name,
        contacts_name: contacts_name,
      };
    } else {
      return {
        user_id: user_id,
        account_number: account_number,
        bank_name: bank_name,
        contacts_name: contacts_name,
      };
    }
  }
}
