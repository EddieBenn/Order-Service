import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { GenderEnum } from '../schemas/customer.schema';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class UpdateCustomerResponseDto {
  @ApiProperty({
    required: false,
    example: 'John',
    description: 'First name of the customer',
  })
  firstName: string;

  @ApiProperty({
    required: false,
    example: 'Doe',
    description: 'Last name of the customer',
  })
  lastName: string;

  @ApiProperty({
    required: false,
    example: '+2348104467932',
    description: 'Phone number of the customer',
  })
  phoneNumber: string;

  @ApiProperty({
    required: false,
    example: 'johndoe@gmail.com',
    description: 'Email of the customer',
  })
  email: string;

  @ApiProperty({
    required: false,
    example: 'male',
    description: 'Gender of the customer',
  })
  gender: GenderEnum;

  @ApiProperty({
    required: false,
    example: 'lagos',
    description: 'City of the customer',
  })
  city: string;
}
