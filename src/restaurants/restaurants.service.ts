import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import ApiFeatures from 'src/utils/apiFeatures.utils';
import { Restaurant } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all restaurants => GET /restaurants
  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = Number(query.resPerPage) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);

    return restaurants;
  }

  // Create a restaurant => POST /restaurants
  async create(restaurantData: Restaurant, user: User): Promise<Restaurant> {
    const location = await ApiFeatures.getRestaurantLocation(
      restaurantData.address,
    );

    const data = Object.assign(restaurantData, { user: user._id, location });

    const restaurant = await this.restaurantModel.create(data);

    return restaurant;
  }

  // Get restaurant by id => /restaurants/:id
  async detail(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(
        'Wrong mongoose ID error. Please enter a correct ID.',
      );
    }

    const restaurant = await this.restaurantModel
      .findById(id)
      .populate('menu')
      .populate('user');

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  // Get restaurants by user
  async getByUser(user: User, query: Query): Promise<Restaurant[]> {
    const resPerPage = Number(query.resPerPage) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const restaurants = await this.restaurantModel
      .find({ ...keyword, user: user._id })
      .limit(resPerPage)
      .skip(skip);

    return restaurants;
  }

  // Update restaurant => PUT /restaurants/:id
  async update(id: string, restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  // Delete restaurant => DELETE /restaurants/:id
  async delete(id: string): Promise<Restaurant> {
    return this.restaurantModel.findByIdAndDelete(id);
  }

  // Upload images => PUT restaurants/upload/:id
  async uploadImages(id: string, files) {
    const images = await ApiFeatures.upload(files);

    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images: images as object[],
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return restaurant;
  }

  async deleteImages(images: any[]) {
    if (images.length === 0) return true;
    const res = await ApiFeatures.deleteImages(images);

    return res;
  }
}
