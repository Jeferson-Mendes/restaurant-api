import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { MealCategoryEnum } from '../shcemas/meal.schema';

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(MealCategoryEnum, {
    message: 'Please enter a correct meal category.',
  })
  @ApiProperty()
  readonly category: MealCategoryEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
