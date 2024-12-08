import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { checkStockAvailability, deductStock } from 'src/utils/axios';

jest.mock('src/utils/axios', () => ({
  checkStockAvailability: jest.fn(),
  deductStock: jest.fn(),
}));

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: DeepMocked<OrdersService>;
  let elasticsearchService: DeepMocked<ElasticsearchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: createMock<OrdersService>(),
        },
        {
          provide: ElasticsearchService,
          useValue: createMock<ElasticsearchService>(),
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
    elasticsearchService = module.get(ElasticsearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('elasticsearchService should be defined', () => {
    expect(elasticsearchService).toBeDefined();
  });

  describe('createOrder', () => {
    const mockOrderPayload = new CreateOrderDto();
    const mockExpectedResponse = new Order();

    it('should create order', async () => {
      (checkStockAvailability as jest.Mock).mockResolvedValue(true);
      (deductStock as jest.Mock).mockResolvedValue(undefined);

      jest
        .spyOn(service, 'createOrder')
        .mockResolvedValue(mockExpectedResponse);

      const createdOrder = await controller.createOrder(mockOrderPayload);

      expect(createdOrder).toEqual(mockExpectedResponse);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if stock is unavailable', async () => {
      (checkStockAvailability as jest.Mock).mockResolvedValue(false);

      jest
        .spyOn(service, 'createOrder')
        .mockRejectedValue(
          new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST),
        );

      try {
        await controller.createOrder(mockOrderPayload);
      } catch (error) {
        expect(error.message).toBe('Insufficient stock');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(deductStock).not.toHaveBeenCalled();
      }
    });

    it('should throw error if no correct order payload', async () => {
      mockOrderPayload.customerId = '';
      mockOrderPayload.itemId = '';

      jest
        .spyOn(service, 'createOrder')
        .mockRejectedValue(
          new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
        );

      try {
        await controller.createOrder(mockOrderPayload);
      } catch (error) {
        expect(error.message).toBe('Bad Request');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getOrderById', () => {
    const orderId = '6750c908ac3253143a7c8d40';

    it('should get one order', async () => {
      const order = new Order();
      jest.spyOn(service, 'getOrderById').mockResolvedValue(order);

      const getorder = await controller.getOrderById(orderId);

      expect(getorder).toEqual(order);
      expect(service.getOrderById).toHaveBeenCalledWith(orderId);
    });

    it('should throw error if order not found', async () => {
      jest
        .spyOn(service, 'getOrderById')
        .mockRejectedValue(
          new HttpException(
            `order with id: ${orderId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.getOrderById(orderId);
      } catch (error) {
        expect(error.message).toBe(`order with id: ${orderId} not found`);
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('deleteOrderById', () => {
    const orderId = '6750c908ac3253143a7c8d40';

    it('should delete the order by id', async () => {
      const mockMessage = {
        message: `Order with id: ${orderId} successfully deleted`,
      };

      jest.spyOn(service, 'deleteOrderById').mockResolvedValue(mockMessage);

      const result = await controller.deleteOrderById(orderId);

      expect(result).toEqual(mockMessage);
      expect(service.deleteOrderById).toHaveBeenCalledWith(orderId);
    });

    it('should throw an error if order not found', async () => {
      jest
        .spyOn(service, 'deleteOrderById')
        .mockRejectedValue(
          new HttpException(
            `Order with id: ${orderId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deleteOrderById(orderId);
      } catch (error) {
        expect(error.message).toBe(`Order with id: ${orderId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
