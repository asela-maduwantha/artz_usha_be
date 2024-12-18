import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNumber, 
  IsPositive, 
  IsOptional, 
  IsEnum, 
  IsString, 
  IsDate, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  @IsPositive()
  user_id: number;

  @ApiPropertyOptional({ description: 'Discount ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discount_id?: number;

  @ApiProperty({ description: 'Order date', type: Date })
  @IsDate()
  @Type(() => Date)
  order_date: Date;

  @ApiProperty({ description: 'Total amount', example: 100.50 })
  @IsNumber()
  @IsPositive()
  total_amount: number;

  @ApiPropertyOptional({ description: 'Discount amount', example: 10.00 })
  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @ApiProperty({ 
    description: 'Order status', 
    enum: OrderStatus, 
    example: OrderStatus.PENDING 
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: 'Shipping address', example: '123 Main St, Cityville' })
  @IsString()
  shipping_address: string;

  @ApiProperty({ 
    description: 'Order items', 
    type: [CreateOrderItemDto] 
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  order_items: CreateOrderItemDto[];
}