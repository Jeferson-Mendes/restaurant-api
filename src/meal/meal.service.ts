import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './shcemas/meal.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: Model<Meal>,

    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
  ) {}

  async list(): Promise<Meal[]> {
    return await this.mealModel.find();
  }

  async findById(id: string): Promise<Meal> {
    const isValid = isValidObjectId(id);

    if (!isValid) {
      throw new BadRequestException('Wrong ID entered.');
    }
    const meal = await this.mealModel.findById(id);

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    return meal;
  }

  async findByRestaurant(restaurant_id: string): Promise<Meal[]> {
    const isValid = isValidObjectId(restaurant_id);

    if (!isValid) {
      throw new BadRequestException('Restaurant ID is invalid.');
    }
    return await this.mealModel.find({ restaurant: restaurant_id });
  }

  async create(createMealDto: CreateMealDto, user: User): Promise<Meal> {
    const data = Object.assign(createMealDto, { user: user._id });

    const createdMeal = await this.mealModel.create(data);

    const restaurant = await this.restaurantModel.findById(
      createMealDto.restaurant,
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }

    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not add meal to this restaurant');
    }

    restaurant.menu.push(createdMeal);
    await restaurant.save();

    return createdMeal;
  }

  // Update meal
  async update(id: string, updateMeal: UpdateMealDto): Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, updateMeal, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const res = await this.mealModel.findByIdAndDelete(id);

    // Remove from Restaurant menu
    const restaurant = await this.restaurantModel.findById(res.restaurant);

    const position = restaurant.menu.indexOf(res);
    restaurant.menu.splice(position, 1);
    await restaurant.save();

    if (res) return { deleted: true };
    return { deleted: false };
  }
}
