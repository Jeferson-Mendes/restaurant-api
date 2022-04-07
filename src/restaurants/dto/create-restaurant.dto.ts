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
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  readonly phoneNo: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsEnum(CategoryEnum, { message: 'Please enter a correct category' })
  readonly category: CategoryEnum;

  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}
