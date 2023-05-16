import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsersDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export default LoginUsersDto;
