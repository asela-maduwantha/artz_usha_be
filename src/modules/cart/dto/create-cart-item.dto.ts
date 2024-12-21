import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Customization options for the product',
    example: { 'size': 'large', 'color': 'red' }
  })
  @IsObject()
  customization_data: Record<string, any>;
}