import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, UserRolesEnum } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import ApiFeatures from '../utils/apiFeatures.utils';

const mockUser = {
  _id: '624c477a809532935c1c217c',
  name: 'Jeff',
  email: 'jeff7@email.com',
  role: UserRolesEnum.USER,
  password: 'hashedPassword',
};

const token = 'jwtToken';

const mockAuthService = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('FindAll', () => {
    it('Should get all users', async () => {
      jest.spyOn(userModel, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockUser]),
            }),
          } as any),
      );

      const users = await service.findAll({ keyword: 'jeff' });
      expect(users).toEqual([mockUser]);
    });
  });

  describe('FindById', () => {
    it('Should get user by Id', async () => {
      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValueOnce(mockUser as never);

      const user = await service.detail(mockUser._id);
      expect(user).toEqual(mockUser);
    });

    it('should throw wrong mongoose id error', async () => {
      await expect(service.detail('wrongId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('SignUp', () => {
    const signUpDto = {
      name: 'Jeff',
      email: 'jeff7@email.com',
      password: 'pass',
    };

    it('Should create a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('testHash' as never);
      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));

      const result = await service.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('Should throw duplicate email entered', async () => {
      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Login', () => {
    const loginDto = {
      email: 'jeff7@email.com',
      password: 'pass',
    };

    it('Should login user and return the token', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
      jest.spyOn(ApiFeatures, 'assignJwtToken').mockResolvedValueOnce(token);

      const result = await service.login(loginDto);

      expect(result.token).toEqual(token);
    });

    it('Should throw invalid email error', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(null),
          } as any),
      );

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Should throw invalid password error', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
