import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto, CustomerFilter } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { Model } from 'mongoose';
import { buildCustomerFilter } from 'src/common/filters/query.filter';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async createCustomer(body: CreateCustomerDto): Promise<Customer> {
    const customer = new this.customerModel(body);
    return await customer.save();
  }

  async getAllCustomers(queryParams?: CustomerFilter) {
    const page = queryParams?.page ? Number(queryParams.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = (page - 1) * size;
    const query = await buildCustomerFilter(queryParams);

    const customers = await this.customerModel
      .find(query)
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });
    const count = await this.customerModel.countDocuments(query);

    const totalPages = Math.ceil(count / size);

    return {
      customers,
      pagination: {
        totalRows: count,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async updateCustomerById(
    id: string,
    data: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();

    if (!customer) {
      throw new HttpException(
        `Customer with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return customer;
  }

  async deleteCustomerById(id: string): Promise<{ message: string }> {
    const customer = await this.customerModel.findByIdAndDelete(id).exec();
    if (!customer) {
      throw new HttpException(
        `customer with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: `Customer with id: ${id} successfully deleted` };
  }
}
