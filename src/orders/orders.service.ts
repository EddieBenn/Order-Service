import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(body: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(body);
    return await order.save();
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
