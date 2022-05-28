import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Meal } from '../../meal/shcemas/meal.schema';
import { User } from '../../auth/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ index: '2dsphere' })
  coordinates: number[];

  @Prop()
  formattedAddress: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipcode: string;

  @Prop()
  country: string;
}

export enum CategoryEnum {
  FAST_FOOD = 'Fast Food',
  CAFE = 'cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  email: string;

  @Prop()
  @ApiProperty()
  phoneNo: string;

  @Prop()
  @ApiProperty()
  address: string;

  @Prop()
  @ApiProperty()
  category: CategoryEnum;

  @Prop()
  @ApiProperty()
  images?: object[];

  @Prop({ type: Object, ref: 'Location' })
  @ApiProperty()
  location?: Location;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
  @ApiProperty()
  menu?: Meal[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  user: User;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
