import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { JwtStrategy } from './jwt.strategy';
import { User, UserRolesEnum } from './schemas/user.schema';

const mockUser = {
  _id: '624c477a809532935c1c217c',
  name: 'Jeff',
  email: 'jeff7@email.com',
  role: UserRolesEnum.USER,
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let model: Model<User>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'jwtSecret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('Should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('Should validate and return the user', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser as any);

      const result = await jwtStrategy.validate({ id: mockUser._id } as any);

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('Should throw Unauthorized Exception', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      expect(jwtStrategy.validate({ id: mockUser._id } as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
