import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { MealCategoryEnum } from '../shcemas/meal.schema';

export class UpdateMealDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(MealCategoryEnum, {
    message: 'Please enter a correct meal category.',
  })
  readonly category: MealCategoryEnum;

  @IsOptional()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
