import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Users {
  @PrimaryGeneratedColumn()
  public user_id: string;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column()
  public user_level: string;
}

export default Users;
