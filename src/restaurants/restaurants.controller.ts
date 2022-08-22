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
  // UploadedFiles,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../auth/schemas/user.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'resPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiOkResponse({
    description: 'Restaurants',
    type: Restaurant,
    isArray: true,
  })
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Requires ADM role',
    description: `Register a restaurant.
      PS: Only ADMs can access this resource.`,
  })
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

  @Get('/filter/get-by-user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'resPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiOkResponse({
    description: 'Restaurants',
    type: Restaurant,
    isArray: true,
  })
  async getRestaurantsByUser(
    @Query() query: ExpressQuery,
    @CurrentUserDecorator() user: User,
  ): Promise<Restaurant[]> {
    return await this.restaurantsService.getByUser(user, query);
  }

  @Put('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Requires ADM role',
    description: `Update a restaurant.
      PS: Only ADMs can access this resource.`,
  })
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
    @CurrentUserDecorator() user: User,
  ): Promise<Restaurant> {
    const res = await this.restaurantsService.detail(id);

    if (String(res.user._id) !== String(user._id)) {
      throw new ForbiddenException('You can not update this restaurant');
    }

    return await this.restaurantsService.update(id, restaurant);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async delete(
    @Param('id') id: string,
    @CurrentUserDecorator() user: User,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.detail(id);

    if (restaurant.user._id.toString() !== user._id.toString()) {
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

  // @Put('upload/:id')
  // @UseGuards(AuthGuard())
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadFiles(
  //   @Param('id') id: string,
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  // ) {
  //   await this.restaurantsService.detail(id);

  //   const res = await this.restaurantsService.uploadImages(id, files);

  //   return res;
  // }
}
