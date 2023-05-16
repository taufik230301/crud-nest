import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactsDto {
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  contacts_name: string;

  user_id: number;
}

export default CreateContactsDto;
