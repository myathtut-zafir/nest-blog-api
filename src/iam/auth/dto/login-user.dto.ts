import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;
}
