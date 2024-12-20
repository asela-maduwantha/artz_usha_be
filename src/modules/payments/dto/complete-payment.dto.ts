// complete-payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CompletePaymentDto {
  @ApiProperty({ description: 'Stripe payment intent ID', example: 'pi_1234567890' })
  @IsString()
  @IsNotEmpty()
  payment_intent_id: string;
}