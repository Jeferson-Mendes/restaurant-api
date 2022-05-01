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
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(MealCategoryEnum, {
    message: 'Please enter a correct meal category.',
  })
  readonly category: MealCategoryEnum;

  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
