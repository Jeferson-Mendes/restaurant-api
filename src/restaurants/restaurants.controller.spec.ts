import { ForbiddenException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesEnum } from '../auth/schemas/user.schema';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

const mockRestaurant = {
  _id: '624f2fdd9a7a4275d7a62100',
  name: 'Delicious food truck with address',
  description: 'This is a description with USER',
  email: 'prod@email.com',
  phoneNo: '5588992999999',
  address: '200 Olympic Dr. Stafford, VS, 22554',
  category: 'Fast Food',
  images: [],
  location: {
    type: 'Point',
    coordinates: [-77.376204, 38.492151],
    formattedAddress: '200 Olympic Dr, Stafford, VA 22554-7763, US',
    city: 'Stafford',
    state: 'VA',
    zipcode: '22554-7763',
    country: 'US',
  },
  user: {
    _id: '624c477a809532935c1c217c',
    name: 'Jeff',
    email: 'jeff7@email.com',
    role: 'user',
    __v: 0,
  },
  __v: 16,
  menu: [
    {
      _id: '62921073d635cdcf9c0ae944',
      name: 'Pasta',
      description: 'Delicious pasta description',
      price: 10,
      category: 'Pasta',
      restaurant: '624f2fdd9a7a4275d7a62100',
      user: '624c477a809532935c1c217c',
      createdAt: '2022-05-28T12:07:15.697Z',
      updatedAt: '2022-05-28T12:07:15.697Z',
      __v: 0,
    },
    {
      _id: '62921076d635cdcf9c0ae94a',
      name: 'Pasta 2',
      description: 'Delicious pasta description',
      price: 10,
      category: 'Pasta',
      restaurant: '624f2fdd9a7a4275d7a62100',
      user: '624c477a809532935c1c217c',
      createdAt: '2022-05-28T12:07:18.916Z',
      updatedAt: '2022-05-28T12:07:18.916Z',
      __v: 0,
    },
    {
      _id: '6292107cd635cdcf9c0ae954',
      name: 'Pasta 4',
      description: 'Delicious pasta description',
      price: 10,
      category: 'Pasta',
      restaurant: '624f2fdd9a7a4275d7a62100',
      user: '624c477a809532935c1c217c',
      createdAt: '2022-05-28T12:07:24.665Z',
      updatedAt: '2022-05-28T12:07:24.665Z',
      __v: 0,
    },
  ],
  updatedAt: '2022-05-28T12:07:53.180Z',
};

const mockUser = {
  _id: '624c477a809532935c1c217c',
  name: 'Jeff',
  email: 'jeff7@email.com',
  role: UserRolesEnum.USER,
};

const mockRestaurantService = {
  findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
  create: jest.fn(),
  detail: jest.fn().mockResolvedValueOnce(mockRestaurant),
  update: jest.fn(),
  deleteImages: jest.fn().mockResolvedValueOnce(true),
  delete: jest.fn().mockResolvedValueOnce({ deleted: true }),
};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetAllRestaurantsController', () => {
    it('should get all restaurants', async () => {
      const result = await controller.getAllRestaurants({
        keyword: 'restaurant',
      });

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRestaurant]);
    });
  });

  describe('CreateRestaurantController', () => {
    it('Should create a new Restaurant', async () => {
      const newRestaurant = {
        name: 'Delicious food truck with address',
        description: 'This is a description with USER',
        email: 'prod@email.com',
        phoneNo: '5588992999999',
        address: '200 Olympic Dr. Stafford, VS, 22554',
        category: 'Fast Food',
      };

      mockRestaurantService.create = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.createRestaurant(
        newRestaurant as any,
        mockUser as any,
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('GetRestaurantById', () => {
    it('Should get Restaurant by ID', async () => {
      const result = await controller.detail(mockRestaurant._id);

      expect(service.detail).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('UpdateRestaurant', () => {
    const restaurant = { ...mockRestaurant, name: 'Updated name' };
    const updateRestaurant = { name: 'Updated name' };
    it('Should update restaurant by Id', async () => {
      mockRestaurantService.detail = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.update = jest
        .fn()
        .mockResolvedValueOnce(restaurant);

      const result = await controller.update(
        restaurant._id,
        updateRestaurant as any,
        mockUser as any,
      );

      expect(service.update).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
      expect(result.name).toEqual(restaurant.name);
    });

    it('Should throw Forbidden error', async () => {
      mockRestaurantService.detail = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const wrongUser = {
        ...mockUser,
        _id: '624c477a809532935c1c217d',
      };

      await expect(
        controller.update(restaurant._id, restaurant as any, wrongUser as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteRestaurant', () => {
    it('Should delete Restaurant by Id', async () => {
      mockRestaurantService.detail = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.delete(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.delete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });

    it('Should not delete Restaurant by Id because images are not deleted', async () => {
      mockRestaurantService.detail = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.deleteImages = jest
        .fn()
        .mockResolvedValueOnce(false);

      const result = await controller.delete(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.delete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: false });
    });

    it('Should throw Forbidden error', async () => {
      mockRestaurantService.detail = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const wrongUser = {
        ...mockUser,
        _id: '624c477a809532935c1c217d',
      };

      await expect(
        controller.delete(mockRestaurant._id, wrongUser as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
