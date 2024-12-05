import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/interceptors/response.decorator';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create Order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({ type: CreateOrderDto })
  @ApiBadRequestResponse()
  @ResponseMessage('Order successfully created')
  @Post()
  async createOrder(@Body() body: CreateOrderDto) {
    try {
      return this.ordersService.createOrder(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Order' })
  @ApiOkResponse({
    type: CreateOrderDto,
    description: 'Order successfully fetched',
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiBadRequestResponse()
  @ResponseMessage('Order successfully fetched')
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    try {
      return this.ordersService.getOrderById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Order' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('Order successfully deleted')
  @Delete(':id')
  deleteOrderById(@Param('id') id: string) {
    try {
      return this.ordersService.deleteOrderById(id);
    } catch (error) {
      throw error;
    }
  }
}
