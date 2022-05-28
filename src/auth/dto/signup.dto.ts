import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRolesEnum } from '../schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Pleace, enter a correct email.' })
  @ApiProperty({ type: String })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String })
  readonly password: string;

  @IsOptional()
  @IsEnum(UserRolesEnum, { message: 'Pleace, enter a correct enum value.' })
  @ApiProperty({ enum: UserRolesEnum })
  readonly role: UserRolesEnum;
}
