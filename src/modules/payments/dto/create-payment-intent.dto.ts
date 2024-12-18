// create-payment-intent.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsArray } from 'class-validator';
import { CreateOrderItemDto } from '../../orders/dto/create-order-item.dto';

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Total amount in cents', example: 10000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  @IsPositive()
  user_id: number;

  @ApiProperty({ 
    description: 'Order items', 
    type: [CreateOrderItemDto] 
  })
  @IsArray()
  order_items: CreateOrderItemDto[];
}

