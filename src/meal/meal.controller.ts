import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { MealService } from './meal.service';
import { Meal } from './shcemas/meal.schema';
import { UpdateMealDto } from './dto/update-meal.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('meals')
@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Meals',
    type: Meal,
    isArray: true,
  })
  async listMeals(): Promise<Meal[]> {
    return await this.mealService.list();
  }

  @Get('/restaurant/:restaurant_id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Meals',
    type: Meal,
    isArray: true,
  })
  async findByRestaurant(@Param('restaurant_id') id: string): Promise<Meal[]> {
    return await this.mealService.findByRestaurant(id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Meal',
    type: Meal,
  })
  async detail(@Param('id') id: string): Promise<Meal> {
    return await this.mealService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async createMeal(
    @CurrentUserDecorator() user: User,
    @Body() createMealDto: CreateMealDto,
  ): Promise<Meal> {
    return await this.mealService.create(createMealDto, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Body() updateMealDto: UpdateMealDto,
    @Param('id') id: string,
    @CurrentUserDecorator() user: User,
  ): Promise<Meal> {
    const meal = await this.mealService.findById(id);

    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not update this meal.');
    }

    return await this.mealService.update(id, updateMealDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async delete(
    @Param('id') id: string,
    @CurrentUserDecorator() user: User,
  ): Promise<{ deleted: boolean }> {
    const meal = await this.mealService.findById(id);

    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not update this meal.');
    }

    return await this.mealService.delete(id);
  }
}
