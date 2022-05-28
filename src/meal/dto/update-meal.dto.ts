import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ required: false })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  readonly description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  readonly price: number;

  @IsOptional()
  @IsEnum(MealCategoryEnum, {
    message: 'Please enter a correct meal category.',
  })
  @ApiProperty({ required: false })
  readonly category: MealCategoryEnum;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
