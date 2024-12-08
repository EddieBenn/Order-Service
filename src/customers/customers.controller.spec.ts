import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CreateCustomerDto, CustomerFilter } from './dto/create-customer.dto';
import { Customer } from './schemas/customer.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { buildCustomerFilter } from 'src/common/filters/query.filter';
import { UpdateCustomerDto } from './dto/update-customer.dto';

jest.mock('../common/filters/query.filter', () => ({
  buildCustomerFilter: jest.fn(),
}));

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: DeepMocked<CustomersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: createMock<CustomersService>(),
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCustomer', () => {
    const mockCustomerPayload = new CreateCustomerDto();
    const mockExpectedResponse = new Customer();

    it('should create customer', async () => {
      jest
        .spyOn(service, 'createCustomer')
        .mockResolvedValue(mockExpectedResponse);

      const createdCustomer =
        await controller.createCustomer(mockCustomerPayload);

      expect(createdCustomer).toEqual(mockExpectedResponse);
      expect(service.createCustomer).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no correct customer payload', async () => {
      mockCustomerPayload.firstName = '';
      mockCustomerPayload.email = '';

      jest
        .spyOn(service, 'createCustomer')
        .mockRejectedValue(
          new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
        );

      try {
        await controller.createCustomer(mockCustomerPayload);
      } catch (error) {
        expect(error.message).toBe('Bad Request');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getAllCustomers', () => {
    const mockItem = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'joe.john@gmail.com',
      phoneNumber: '+2348104487456',
      gender: 'male',
      city: 'ibadan',
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: '63cbca5ca24049182f24939',
      __v: 0,
    };

    const mockQueryParams: CustomerFilter = {
      page: 1,
      size: 10,
      firstName: 'John',
      lastName: 'Doe',
      email: 'joe.john@gmail.com',
      phoneNumber: '+2348104487456',
    };

    const expectedResult = {
      customers: [mockItem as any],
      pagination: {
        totalRows: 30,
        perPage: 10,
        currentPage: 1,
        totalPages: Math.ceil(30 / 10),
        hasNextPage: 1 < Math.ceil(30 / 10),
      },
    };

    it('should return all customers with pagination', async () => {
      (buildCustomerFilter as jest.Mock).mockResolvedValue(mockQueryParams);

      jest.spyOn(service, 'getAllCustomers').mockResolvedValue(expectedResult);

      const allCustomers = await controller.getAllCustomers(mockQueryParams);

      expect(allCustomers).toEqual(expectedResult);
      expect(service.getAllCustomers).toHaveBeenCalledWith(mockQueryParams);
    });

    it('should throw error on failure', async () => {
      mockQueryParams.page = -1;
      mockQueryParams.size = 2;

      jest
        .spyOn(service, 'getAllCustomers')
        .mockRejectedValue(
          new HttpException(
            'Invalid query parameters',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.getAllCustomers(mockQueryParams);
      } catch (error) {
        expect(error.message).toBe('Invalid query parameters');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('updateCustomerById', () => {
    const customerId = '6750c908ac3253143a7c8d35';
    const updatePayload = new UpdateCustomerDto();
    const updateData = new Customer();

    it('should update and return the customer', async () => {
      jest.spyOn(service, 'updateCustomerById').mockResolvedValue(updateData);

      const result = await controller.updateCustomerById(
        customerId,
        updatePayload,
      );

      expect(result).toEqual(updateData);
      expect(service.updateCustomerById).toHaveBeenCalledWith(
        customerId,
        updatePayload,
      );
    });

    it('should throw an error if customer not found', async () => {
      jest
        .spyOn(service, 'updateCustomerById')
        .mockRejectedValue(
          new HttpException(
            `Customer with id: ${customerId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateCustomerById(customerId, updatePayload);
      } catch (error) {
        expect(error.message).toBe(`Customer with id: ${customerId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteCustomerById', () => {
    const customerId = '6750c908ac3253143a7c8d35';

    it('should delete the customer by id', async () => {
      const mockMessage = {
        message: `Customer with id: ${customerId} successfully deleted`,
      };

      jest.spyOn(service, 'deleteCustomerById').mockResolvedValue(mockMessage);

      const result = await controller.deleteCustomerById(customerId);

      expect(result).toEqual(mockMessage);
      expect(service.deleteCustomerById).toHaveBeenCalledWith(customerId);
    });

    it('should throw an error if customer not found', async () => {
      jest
        .spyOn(service, 'deleteCustomerById')
        .mockRejectedValue(
          new HttpException(
            `Customer with id: ${customerId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deleteCustomerById(customerId);
      } catch (error) {
        expect(error.message).toBe(`Customer with id: ${customerId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
