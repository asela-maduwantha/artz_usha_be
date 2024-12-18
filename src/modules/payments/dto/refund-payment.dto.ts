import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

// Define valid refund reasons as per Stripe's API
export enum RefundReason {
  DUPLICATE = 'duplicate',
  FRAUDULENT = 'fraudulent',
  REQUESTED_BY_CUSTOMER = 'requested_by_customer',
}

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  payment_id: number;

  @ApiProperty({ description: 'Refund amount in cents', example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ 
    description: 'Refund reason', 
    enum: RefundReason,
    example: RefundReason.REQUESTED_BY_CUSTOMER,
    required: false 
  })
  @IsEnum(RefundReason)
  @IsOptional()
  reason?: RefundReason;
}