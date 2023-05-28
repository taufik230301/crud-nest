import { FindManyOptions, QueryRunner } from 'typeorm';
import CreateContactsDto from '../dto/createContacts.dto';
import UpdateContactsDto from '../dto/updateContacts.dto';
import Contacts from '../entity/contact.entity';
import { ADMIN_USER_LEVEL } from '../contact.constant';

export async function createContactInDatabase(
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

export async function readContactInDatabase(
  queryRunner: QueryRunner,
  options: FindManyOptions<Contacts>,
) {
  const newContacts = await queryRunner.manager.find(Contacts, options);

  return newContacts;
}

export async function deleteContactInDatabase(
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

export async function updateContactInDatabase(
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

export async function SuccessResponse(
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

export async function ErrorResponse(
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

export async function createWhereOptions(
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
