import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContactsDto {
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  contacts_name: string;
}

export default UpdateContactsDto;
