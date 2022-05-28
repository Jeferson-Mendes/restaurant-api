import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Get users
  @Get('/users')
  @ApiOkResponse({
    description: 'Users',
    type: User,
    isArray: true,
  })
  async list(@Query() query: ExpressQuery): Promise<User[]> {
    return await this.authService.findAll(query);
  }

  // User Detail
  @Get('/users/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User',
    type: User,
  })
  async detail(@Param('id') id: string): Promise<User> {
    return await this.authService.detail(id);
  }

  // Register user
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: User; token: string }> {
    return await this.authService.login(loginDto);
  }
}
