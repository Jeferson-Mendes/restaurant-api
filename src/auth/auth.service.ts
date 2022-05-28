import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import ApiFeatures from '../utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';
import { Query } from 'express-serve-static-core';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Get users
  async findAll(query: Query): Promise<User[]> {
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

    const users = await this.userModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);

    return users;
  }

  // User detail
  async detail(userId: string): Promise<User> {
    const isValidId = isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }

    return await this.userModel.findById(userId);
  }

  // Register user
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password, role } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return user;
    } catch (error) {
      // Handle duplicate email
      if (error.code === 11000) {
        throw new ConflictException('Duplicate Email entered');
      }
    }
  }

  // Login
  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await ApiFeatures.assignJwtToken(user._id, this.jwtService);

    return { user, token };
  }
}
