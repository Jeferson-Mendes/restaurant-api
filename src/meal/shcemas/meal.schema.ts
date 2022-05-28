import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

export enum MealCategoryEnum {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  SANDWICHES = 'Sandwiches',
  PASTA = 'Pasta',
}

@Schema({ timestamps: true })
export class Meal {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  price: number;

  @Prop()
  @ApiProperty()
  category: MealCategoryEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  @ApiProperty()
  restaurant: Restaurant;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  user: User;
}

export const MEalSchema = SchemaFactory.createForClass(Meal);
