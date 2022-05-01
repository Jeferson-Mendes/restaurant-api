import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';
import { MEalSchema } from './shcemas/meal.schema';

@Module({
  imports: [
    AuthModule,
    RestaurantsModule,
    MongooseModule.forFeature([{ name: 'Meal', schema: MEalSchema }]),
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
