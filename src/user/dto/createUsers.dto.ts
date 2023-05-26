import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  user_level: string;
}

export default CreateUsersDto;
