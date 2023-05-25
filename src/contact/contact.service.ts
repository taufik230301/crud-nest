import { Injectable, Logger } from '@nestjs/common';
import Contacts from './entity/contact.entity';
import { DataSource, FindManyOptions } from 'typeorm';
import CreateContactsDto from './dto/createContacts.dto';
import UpdateContactsDto from './dto/updateContacts.dto';

@Injectable()
export class ContactsService {
  constructor(private dataSource: DataSource) {}
  private readonly logger = new Logger(ContactsService.name);

  where_options: any;

  async getAllContacts(
    user_id: number,
    user_level: number,
    account_number: string,
    bank_name: string,
    contacts_name: string,
  ) {
    this.logger.log('getAllContacts function called.');

    this.logger.log(
      'Checking if permisions is admin then give all access to contacts data',
    );
    if (user_level == 0) {
      this.where_options = {
        account_number: account_number,
        bank_name: bank_name,
        contacts_name: contacts_name,
      };
    } else {
      this.where_options = {
        user_id: user_id,
        account_number: account_number,
        bank_name: bank_name,
        contacts_name: contacts_name,
      };
    }

    this.logger.log('Creating options object');
    const options: FindManyOptions<Contacts> = {
      where: this.where_options,
    };

    this.logger.log('Creating queryRunner.');
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      this.logger.log('Establishing database connection.');
      await queryRunner.connect();

      this.logger.log('Starting database transaction.');
      await queryRunner.startTransaction();

      this.logger.log('Query executed:');
      const contacts = await queryRunner.manager.find(Contacts, options);
      this.logger.log('Checking If contacts found in the database.');
      if (contacts.length > 0) {
        this.logger.log('Committing database transaction.');
        await queryRunner.commitTransaction();
        return { data: contacts, status: 200 };
      } else {
        this.logger.log('Rolling back database transaction.');
        await queryRunner.rollbackTransaction();
        return { data: contacts, status: 204 };
      }
    } catch (err) {
      this.logger.log('Error occurred. Rolling back database transaction.');
      await queryRunner.rollbackTransaction();
      return { data: err, status: 500 };
    } finally {
      this.logger.log('Releasing database query runner.');
      await queryRunner.release(); // Release the queryRunner after using it
    }
  }

  async createContacts(contacts: CreateContactsDto) {
    this.logger.log('createContacts function called.');
    this.logger.log('Creating queryRunner.');
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      this.logger.log('Establishing database connection.');
      await queryRunner.connect();
      this.logger.log('Starting database transaction.');
      await queryRunner.startTransaction();
      const newContacts = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Contacts)
        .values(contacts)
        .execute();
      this.logger.log('Query executed');
      if (newContacts) {
        this.logger.log('Committing database transaction.');
        await queryRunner.commitTransaction();
        return { data: contacts, status: 200 };
      } else {
        this.logger.log('Rolling back database transaction.');
        await queryRunner.rollbackTransaction();
        return { data: contacts, status: 500 };
      }
    } catch (err) {
      this.logger.log('Error occurred. Rolling back database transaction.');
      await queryRunner.rollbackTransaction();
      return { data: err, status: 500 };
    } finally {
      this.logger.log('Releasing database query runner.');
      await queryRunner.release(); // Release the queryRunner after using it
    }
  }

  async getContactsById(
    id_contacts: string,
    user_id: number,
    user_level: number,
  ) {
    this.logger.log('getContactsById function called.');

    this.logger.log(
      'Checking if permisions is admin then give all access to contacts data',
    );
    if (user_level == 0) {
      this.where_options = {
        id_contacts: id_contacts,
      };
    } else {
      this.where_options = {
        id_contacts: id_contacts,
        user_id: user_id,
      };
    }
    this.logger.log('Creating options object');
    const options: FindManyOptions<Contacts> = {
      where: this.where_options,
    };
    this.logger.log('Creating queryRunner.');
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      this.logger.log('Establishing database connection.');
      await queryRunner.connect();
      this.logger.log('Starting database transaction.');
      await queryRunner.startTransaction();
      this.logger.log('Query executed');
      const contacts = await queryRunner.manager.find(Contacts, options);
      this.logger.log('Checking If contacts found in the database.');
      if (contacts.length > 0) {
        this.logger.log('Checking If Permission is admin.');
        if (user_level == 0) {
          this.logger.log('Committing database transaction.');
          await queryRunner.commitTransaction();
          return { data: contacts, status: 200 };
        } else {
          if (contacts[0].user_id == user_id) {
            this.logger.log('Committing database transaction.');
            await queryRunner.commitTransaction();
            return { data: contacts, status: 200 };
          } else {
            this.logger.log('Rolling back database transaction.');
            await queryRunner.rollbackTransaction();
            return { data: contacts, status: 403 };
          }
        }
      } else {
        this.logger.log('Rolling back database transaction.');
        await queryRunner.rollbackTransaction();
        return { data: contacts, status: 204 };
      }
    } catch (err) {
      this.logger.log(
        'Error occurred. Rolling back database transaction.',
        err,
      );
      await queryRunner.rollbackTransaction();
      return { data: err, status: 500 };
    } finally {
      this.logger.log('Releasing database query runner.');
      await queryRunner.release(); // Release the queryRunner after using it
    }
  }

  async updateContacts(
    id_contacts: string,
    contacts: UpdateContactsDto,
    user_id: number,
    user_level: number,
  ) {
    this.logger.log('updateContacts function called.');
    this.logger.log('Creating options object');
    const options: FindManyOptions<Contacts> = {
      where: {
        id_contacts: id_contacts,
      },
    };
    this.logger.log('Creating queryRunner.');
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      this.logger.log('Establishing database connection.');
      await queryRunner.connect();
      this.logger.log('Starting database transaction.');
      await queryRunner.startTransaction();
      const currentContacts = await queryRunner.manager.find(Contacts, options);
      this.logger.log('Checking If contacts found in the database.');
      if (currentContacts.length > 0) {
        this.logger.log('Checking If Permission is admin.');
        if (user_level == 0) {
          this.logger.log('Updating contacts in the database.');
          const updated_contact = await queryRunner.manager
            .createQueryBuilder()
            .update(Contacts)
            .set(contacts)
            .where('id_contacts = :id', { id: id_contacts })
            .execute();
          if (updated_contact.affected) {
            this.logger.log('Committing database transaction.');
            await queryRunner.commitTransaction();
            return { data: contacts, status: 200 };
          } else {
            this.logger.log('Rolling back database transaction.');
            await queryRunner.rollbackTransaction();
            return { data: contacts, status: 404 };
          }
        } else {
          if (currentContacts[0].user_id == user_id) {
            this.logger.log('Updating contacts in the database.');
            const updated_contact = await queryRunner.manager
              .createQueryBuilder()
              .update(Contacts)
              .set(contacts)
              .where('id_contacts = :id', { id: id_contacts })
              .execute();

            if (updated_contact.affected) {
              this.logger.log('Committing database transaction.');
              await queryRunner.commitTransaction();
              return { data: contacts, status: 200 };
            } else {
              this.logger.log('Rolling back database transaction.');
              await queryRunner.rollbackTransaction();
              return { data: contacts, status: 404 };
            }
          } else {
            this.logger.log('Rolling back database transaction.');
            await queryRunner.rollbackTransaction();
            return { data: contacts, status: 403 };
          }
        }
      } else {
        this.logger.log('Rolling back database transaction.');
        await queryRunner.rollbackTransaction();
        return { data: contacts, status: 204 };
      }
    } catch (err) {
      this.logger.log(
        'Error occurred. Rolling back database transaction.',
        err,
      );
      await queryRunner.rollbackTransaction();
      return { data: err, status: 500 };
    } finally {
      this.logger.log('Releasing database query runner.');
      await queryRunner.release(); // Release the queryRunner after using it
    }
  }

  async deleteContact(
    id_contacts: string,
    user_id: number,
    user_level: number,
  ) {
    this.logger.log('deleteContact function called.');
    this.logger.log('Creating options object');
    const options: FindManyOptions<Contacts> = {
      where: {
        id_contacts: id_contacts,
      },
    };
    this.logger.log('Creating queryRunner.');
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      this.logger.log('Establishing database connection.');
      await queryRunner.connect();
      this.logger.log('Starting database transaction.');
      await queryRunner.startTransaction();
      this.logger.log('Query executed');
      const deletedContacts = await queryRunner.manager.find(Contacts, options);

      this.logger.log('Checking if contacts found in the database.');
      if (deletedContacts.length > 0) {
        this.logger.log('Checking If Permission is admin.');
        if (user_level == 0) {
          this.logger.log('Deleting contact from the database.');
          const deleted = await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Contacts)
            .where('id_contacts = :id', { id: id_contacts })
            .execute();
          if (deleted.affected > 0) {
            this.logger.log('Committing database transaction.');
            await queryRunner.commitTransaction();
            return { data: deletedContacts, status: 200 };
          } else {
            this.logger.log('Rolling back database transaction.');
            await queryRunner.rollbackTransaction();
            return { data: deletedContacts, status: 404 };
          }
        } else {
          if (deletedContacts[0].user_id == user_id) {
            this.logger.log('Deleting contact from the database.');
            const deleted = await queryRunner.manager
              .createQueryBuilder()
              .delete()
              .from(Contacts)
              .where('id_contacts = :id', { id: id_contacts })
              .execute();
            if (deleted.affected > 0) {
              this.logger.log('Committing database transaction.');
              await queryRunner.commitTransaction();
              return { data: deletedContacts, status: 200 };
            } else {
              this.logger.log('Rolling back database transaction.');
              await queryRunner.rollbackTransaction();
              return { data: deletedContacts, status: 404 };
            }
          } else {
            this.logger.log('Rolling back database transaction.');
            await queryRunner.rollbackTransaction();
            return { data: deletedContacts, status: 403 };
          }
        }
      } else {
        this.logger.log('Rolling back database transaction.');
        await queryRunner.rollbackTransaction();
        return { data: deletedContacts, status: 204 };
      }
    } catch (err) {
      this.logger.log(
        'Error occurred. Rolling back database transaction.',
        err,
      );
      await queryRunner.rollbackTransaction();
      return { data: err, status: 500 };
    } finally {
      this.logger.log('Releasing database query runner.');
      await queryRunner.release(); // Release the queryRunner after using it
    }
  }
}
