import { Injectable } from '@nestjs/common';
import Contacts from './entity/contact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateContactsDto from './dto/createContacts.dto';
import UpdateContactsDto from './dto/updateContacts.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contacts)
    private contactsRepository: Repository<Contacts>,
  ) {}

  async getAllContacts(
    user_id: number,
    account_number: string,
    bank_name: string,
    contacts_name: string,
  ) {
    try {
      const contacts = await this.contactsRepository.findBy({
        user_id: user_id,
        account_number: account_number,
        bank_name: bank_name,
        contacts_name: contacts_name,
      });
      if (contacts) {
        return {
          message: 'Success Get Data',
          statusCode: '200',
          data: contacts,
        };
      } else {
        return {
          message: 'Success Get Data, But No Contacts Found',
          statusCode: '204',
          data: contacts,
        };
      }
    } catch (err) {
      return {
        message: err,
        statusCode: '500',
      };
    }
  }

  async createContacts(contacts: CreateContactsDto, user_id: number) {
    try {
      contacts.user_id = user_id;

      const newContacts = await this.contactsRepository.insert(contacts);
      if (newContacts) {
        return {
          message: 'Success created data',
          statusCode: '200',
          data: contacts,
        };
      }
    } catch (err) {
      return {
        message: err,
        statusCode: '500',
        data: contacts,
      };
    }
  }

  async getContactsById(id_contacts: string, user_id: number) {
    try {
      const contacts = await this.contactsRepository.findOneBy({
        id_contacts: id_contacts,
      });

      if (contacts) {
        if (contacts.user_id == user_id) {
          return {
            message: 'Success Get Data',
            statusCode: '200',
            data: contacts,
          };
        } else {
          return {
            message: `Cannot get data that doesn't belong to you.`,
            statusCode: '204',
            data: contacts,
          };
        }
      } else {
        return {
          message: `Cannot get data that doesn't exist`,
          statusCode: '204',
          data: contacts,
        };
      }
    } catch (err) {
      return {
        message: err,
        statusCode: '500',
      };
    }
  }

  async updateContacts(
    id_contacts: string,
    contacts: UpdateContactsDto,
    user_id: number,
  ) {
    try {
      const currentContacts = await this.contactsRepository.findOneBy({
        id_contacts: String(id_contacts),
      });
      if (currentContacts) {
        if (currentContacts.user_id == user_id) {
          const updated_contact = await this.contactsRepository.update(
            id_contacts,
            contacts,
          );

          if (updated_contact.affected) {
            return {
              message: 'Success Updated Data',
              statusCode: '200',
              data: contacts,
            };
          }
        } else {
          return {
            message: `Cannot update data that doesn't belong to you`,
            statusCode: '204',
            data: contacts,
          };
        }
      } else {
        return {
          message: `Cannot update data that doesn't exist`,
          statusCode: '204',
          data: contacts,
        };
      }
    } catch (err) {
      return {
        message: err,
        statusCode: '500',
      };
    }
  }

  async deleteContact(id_contacts: string, user_id: number) {
    try {
      const deletedContacts = await this.contactsRepository.findOneBy({
        id_contacts: String(id_contacts),
      });

      if (deletedContacts) {
        if (deletedContacts.user_id == user_id) {
          const deleted = await this.contactsRepository.delete(id_contacts);
          if (deleted.affected) {
            return {
              message: 'Success Deleted Data',
              statusCode: '200',
              data: deletedContacts,
            };
          }
        } else {
          return {
            message: `Cannot delete date that doesn't belong to you`,
            statusCode: '204',
            data: deletedContacts,
          };
        }
      } else {
        return {
          message: `Cannot delete data that doesn't exist`,
          statusCode: '204',
          data: deletedContacts,
        };
      }
    } catch (err) {
      return {
        message: err,
        statusCode: '500',
      };
    }
  }
}
