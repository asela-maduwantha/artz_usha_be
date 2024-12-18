import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;
}