import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { UserRolesEnum } from '../auth/schemas/user.schema';
import ApiFeatures from '../utils/apiFeatures.utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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
  email: 'maria@email.com',
  name: 'Maria',
  role: UserRolesEnum.USER,
};

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

describe('RestaurantService', () => {
  let service: RestaurantsService;
  let restaurantModel: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    restaurantModel = module.get<Model<Restaurant>>(
      getModelToken(Restaurant.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should get all restaurants', async () => {
      jest.spyOn(restaurantModel, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          } as any),
      );

      const restaurants = await service.findAll({ keyword: 'Delicious' });
      expect(restaurants).toEqual([mockRestaurant]);
    });
  });

  describe('create', () => {
    const newRestaurant = {
      name: 'Delicious food truck with address',
      description: 'This is a description with USER',
      email: 'prod@email.com',
      phoneNo: '5588992999999',
      address: '200 Olympic Dr. Stafford, VS, 22554',
      category: 'Fast Food',
    };

    it('should create a new restaurant', async () => {
      jest
        .spyOn(ApiFeatures, 'getRestaurantLocation')
        .mockImplementation(() => Promise.resolve(mockRestaurant.location));

      jest
        .spyOn(restaurantModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant));

      const result = await service.create(
        newRestaurant as any,
        mockUser as any,
      );
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('findById', () => {
    it('should get restaurant by Id', async () => {
      jest.spyOn(restaurantModel, 'findById').mockImplementationOnce(
        () =>
          ({
            populate: () => ({
              populate: jest.fn().mockResolvedValueOnce(mockRestaurant),
            }),
          } as any),
      );

      const restaurant = await service.detail(mockRestaurant._id);
      expect(restaurant).toEqual(mockRestaurant);
    });

    it('should throw wrong mongoose id error', async () => {
      await expect(service.detail('wrongId')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw restaurant not found exception.', async () => {
      const mockError = new NotFoundException('Restaurant not found');
      jest.spyOn(restaurantModel, 'findById').mockImplementationOnce(
        () =>
          ({
            populate: () => ({
              populate: jest.fn().mockRejectedValue(mockError),
            }),
          } as any),
      );

      await expect(service.detail(mockRestaurant._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update the restaurant', async () => {
      const restaurant = { ...mockRestaurant, name: 'Updated name' };
      const updateRestaurant = { name: 'Updated name' };

      jest
        .spyOn(restaurantModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(restaurant as any);

      const updatedRestaurant = await service.update(
        restaurant._id,
        updateRestaurant.name as any,
      );

      expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
    });
  });
});
