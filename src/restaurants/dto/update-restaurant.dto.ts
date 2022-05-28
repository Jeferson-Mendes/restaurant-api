import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ type: String, required: false })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  readonly description: string;

  @IsEmail({}, { message: 'Please enter a correct email' })
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  readonly email: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  readonly phoneNo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  readonly address: string;

  @IsEnum(CategoryEnum, { message: 'Please enter a correct category' })
  @IsOptional()
  @ApiProperty({ enum: CategoryEnum, required: false })
  readonly category: CategoryEnum;

  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}
