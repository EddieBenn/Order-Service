import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, CustomerFilter } from './dto/create-customer.dto';
import {
  UpdateCustomerDto,
  UpdateCustomerResponseDto,
} from './dto/update-customer.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/interceptors/response.decorator';
import { PaginationResponseDto } from './dto/paginate.dto';
@ApiTags('Customer')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create Customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiCreatedResponse({ type: CreateCustomerDto })
  @ApiBadRequestResponse()
  @ResponseMessage('Customer successfully created')
  @Post()
  async createCustomer(@Body() body: CreateCustomerDto) {
    try {
      return this.customersService.createCustomer(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Customers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phoneNumber', required: false, type: String })
  @ApiQuery({ name: 'gender', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Paginated list of customers',
  })
  @ApiBadRequestResponse()
  @ResponseMessage('All customers successfully fetched')
  @Get()
  async getAllCustomers(@Query() query?: CustomerFilter) {
    try {
      return this.customersService.getAllCustomers(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Customer' })
  @ApiBody({ type: UpdateCustomerResponseDto })
  @ApiOkResponse({ description: 'Customer successfully updated' })
  @ApiBadRequestResponse()
  @ResponseMessage('Customer successfully updated')
  @Put(':id')
  updateCustomerById(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
    try {
      return this.customersService.updateCustomerById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Customer' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('Customer successfully deleted')
  @Delete(':id')
  deleteCustomerById(@Param('id') id: string) {
    try {
      return this.customersService.deleteCustomerById(id);
    } catch (error) {
      throw error;
    }
  }
}
