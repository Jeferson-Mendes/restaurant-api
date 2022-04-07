import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
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
}
