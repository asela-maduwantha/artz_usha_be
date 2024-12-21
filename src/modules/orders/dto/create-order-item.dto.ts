import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { OrderItemCustomizationDto } from './order-item-customization.dto';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product to be ordered',
    example: 123
  })
  @IsNumber()
  product_id: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'List of customizations for the product',
    type: [OrderItemCustomizationDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemCustomizationDto)
  customizations: OrderItemCustomizationDto[];
}