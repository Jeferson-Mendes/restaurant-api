import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
  }

  @Get('/:id')
  async detail(@Param('id') id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantsService.detail(id);
    return restaurant;
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.restaurantsService.detail(id);

    return await this.restaurantsService.update(id, restaurant);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.detail(id);

    const isDeleted = await this.restaurantsService.deleteImages(
      restaurant.images,
    );

    if (isDeleted) {
      await this.restaurantsService.delete(id);

      return {
        deleted: true,
      };
    } else {
      return {
        deleted: false,
      };
    }
  }

  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.detail(id);

    const res = await this.restaurantsService.uploadImages(id, files);

    return res;
  }
}
