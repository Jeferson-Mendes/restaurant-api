import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CurrentUserDecorator } from 'src/auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../auth/schemas/user.schema';
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
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  async createRestaurant(
    @CurrentUserDecorator() user: User,
    @Body() restaurant: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  @Get('/:id')
  async detail(@Param('id') id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantsService.detail(id);
    return restaurant;
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
    @CurrentUserDecorator() user: User,
  ): Promise<Restaurant> {
    const res = await this.restaurantsService.detail(id);

    if (String(res.user) !== String(user._id)) {
      throw new ForbiddenException('You can not update this restaurant');
    }

    return await this.restaurantsService.update(id, restaurant);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async delete(
    @Param('id') id: string,
    @CurrentUserDecorator() user: User,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.detail(id);

    if (String(restaurant.user) !== String(user._id)) {
      throw new ForbiddenException('You can not delete this restaurant');
    }

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
  @UseGuards(AuthGuard())
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
