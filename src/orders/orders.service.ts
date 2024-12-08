import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { checkStockAvailability, deductStock } from 'src/utils/axios';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async createOrder(body: CreateOrderDto): Promise<Order> {
    const { itemId, quantity } = body;

    const stockAvailable = await checkStockAvailability(itemId, quantity);
    if (!stockAvailable) {
      throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
    }

    const order = new this.orderModel(body);
    const savedOrder = await order.save();
    await deductStock(itemId, quantity);
    return savedOrder;
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: 'stock.*',
    queue: 'order_service_queue',
  })
  async handleStockEvent(message: any) {
    console.log('Received stock event:', message);

    await this.elasticsearchService.index({
      index: 'stock-updates',
      body: {
        itemId: message.id,
        name: message.name,
        stock: message.stock,
        timestamp: new Date(),
      },
    });
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order?.id) {
      throw new HttpException(
        `order with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return order;
  }

  async deleteOrderById(id: string): Promise<{ message: string }> {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new HttpException(
        `order with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: `Order with id: ${id} successfully deleted` };
  }
}
