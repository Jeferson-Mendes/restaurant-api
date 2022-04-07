import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Pleace, enter a correct email.' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}