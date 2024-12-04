import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: '6750c908bc6233143a7c8d35',
    description: 'Id of the item to be ordered',
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({
    example: '20',
    description: 'Number of items to be order',
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: '6850c304bc6233143a7c8e42',
    description: 'Id of the customer placing the order',
  })
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
