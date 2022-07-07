import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';

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
  user: '624c477a809532935c1c217c',
  __v: 6,
  menu: [
    '62920ef546aa2a41e5c6a5a4',
    '62920ef946aa2a41e5c6a5aa',
    '62920efd46aa2a41e5c6a5af',
  ],
  updatedAt: '2022-05-28T12:01:01.527Z',
};

const mockRestaurantService = {
  find: jest.fn(),
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
});
