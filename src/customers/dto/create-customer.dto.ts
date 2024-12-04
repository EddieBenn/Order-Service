import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { GenderEnum } from '../schemas/customer.schema';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the customer',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the customer',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'Email of the customer',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+2348004467234',
    description: 'Phone number of the customer',
  })
  @IsNotEmpty()
  @MinLength(10)
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'lagos',
    description: 'City of the customer',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'male', description: 'Gender of the user' })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;
}

export interface CustomerFilter {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  size?: number;
  page?: number;
}
