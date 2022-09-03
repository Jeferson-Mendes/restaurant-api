import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRolesEnum } from './schemas/user.schema';

const mockUser = {
  _id: '624c477a809532935c1c217c',
  name: 'Jeff',
  email: 'jeff7@email.com',
  role: UserRolesEnum.USER,
};

const jwtToken = 'jwtToken';

const mockAuthService = {
  findAll: jest.fn().mockResolvedValueOnce([mockUser]),
  detail: jest.fn().mockResolvedValueOnce(mockUser),
  signUp: jest.fn().mockResolvedValueOnce(mockUser),
  login: jest.fn().mockResolvedValueOnce({ user: mockUser, token: jwtToken }),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('FindAllUsers', () => {
    it('Should get all users', async () => {
      const result = await controller.list({ keyword: 'jeff' });

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('GetUserById', () => {
    it('Should get user by Id', async () => {
      const result = await controller.detail(mockUser._id);

      expect(service.detail).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('Signup', () => {
    it('Should register a new user', async () => {
      const newUser = {
        name: 'Jeff',
        email: 'jeff7@email.com',
        password: 'hashedPassword',
      };

      mockAuthService.signUp = jest.fn().mockResolvedValueOnce(mockUser);

      const result = await controller.signUp(newUser);

      expect(service.signUp).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('Login', () => {
    it('Should login user and return JWT token', async () => {
      const loginDto = {
        email: 'jeff7@email.com',
        password: 'pass',
      };

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalled();
      expect(result).toEqual({ user: mockUser, token: jwtToken });
    });
  });
});
