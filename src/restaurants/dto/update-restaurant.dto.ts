import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { CategoryEnum } from '../schemas/restaurant.schema';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsEmail({}, { message: 'Please enter a correct email' })
  @IsOptional()
  readonly email: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  readonly phoneNo: string;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsEnum(CategoryEnum, { message: 'Please enter a correct category' })
  @IsOptional()
  readonly category: CategoryEnum;

  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}
