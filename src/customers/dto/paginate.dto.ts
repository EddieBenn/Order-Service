import { ApiProperty } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class PaginationMetadataDto {
  @ApiProperty({
    example: 100,
    description: 'The total number of customers',
  })
  totalRows: number;

  @ApiProperty({
    example: 10,
    description: 'Number of customers per page',
  })
  perPage: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page',
  })
  hasNextPage: boolean;
}

export class PaginationResponseDto {
  @ApiProperty({
    type: [CreateCustomerDto],
    description: 'Array of customer objects',
  })
  customer: CreateCustomerDto[];

  @ApiProperty({
    type: PaginationMetadataDto,
    description: 'Pagination metadata',
  })
  pagination: PaginationMetadataDto;
}
