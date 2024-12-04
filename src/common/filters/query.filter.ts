import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomerFilter } from 'src/customers/dto/create-customer.dto';

export const buildCustomerFilter = async (queryParams: CustomerFilter) => {
  const query: Record<string, any> = {};

  if (queryParams?.firstName)
    query['firstName'] = queryParams.firstName.toLowerCase();
  if (queryParams?.lastName)
    query['lastName'] = queryParams.lastName.toLowerCase();
  if (queryParams?.email) query['email'] = queryParams.email.toLowerCase();
  if (queryParams?.phoneNumber) query['phoneNumber'] = queryParams.phoneNumber;
  if (queryParams?.gender) query['gender'] = queryParams.gender.toLowerCase();
  if (queryParams?.city) query['city'] = queryParams.city.toLowerCase();

  if (queryParams?.startDate && queryParams?.endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.startDate)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['createdAt'] = {};
    if (queryParams.startDate) {
      query['createdAt'].$gte = new Date(queryParams.startDate);
    }
    if (queryParams.endDate) {
      query['createdAt'].$lte = new Date(queryParams.endDate);
    }
  }
  return query;
};
