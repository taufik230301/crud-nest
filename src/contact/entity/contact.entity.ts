import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Contacts {
  @PrimaryGeneratedColumn()
  public id_contacts: string;

  @Column()
  public account_number: string;

  @Column()
  public bank_name: string;

  @Column()
  public contacts_name: string;

  @Column()
  public user_id: number;
}

export default Contacts;
