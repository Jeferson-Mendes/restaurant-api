import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { CategoryEnum } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly description: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email' })
  @ApiProperty({ type: String })
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  @ApiProperty({ type: String })
  readonly phoneNo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly address: string;

  @IsEnum(CategoryEnum, { message: 'Please enter a correct category' })
  @ApiProperty({ enum: CategoryEnum })
  readonly category: CategoryEnum;

  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}
