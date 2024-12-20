// payment.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    UseGuards,
    ParseIntPipe 
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBearerAuth 
  } from '@nestjs/swagger';
  import { PaymentsService } from './payments.service';
  import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
  import { CompletePaymentDto } from './dto/complete-payment.dto';
  import { RefundPaymentDto } from './dto/refund-payment.dto';

  
  @ApiTags('Payments')
  @ApiBearerAuth()
  @Controller('payments')
  export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) {}
  
    @Post('create-intent')
    @ApiOperation({ summary: 'Create a payment intent' })
    @ApiResponse({ 
      status: 201, 
      description: 'Returns client secret for Stripe payment',
    })
    createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
      return this.paymentService.createPaymentIntent(dto);
    }
  
    @Post('complete')
    @ApiOperation({ summary: 'Complete payment and create order' })
    @ApiResponse({ 
      status: 201, 
      description: 'Payment completed and order created',
    })
    completePayment(@Body() dto: CompletePaymentDto) {
      return this.paymentService.completePayment(dto);
    }
  
    @Post('refund')
    @ApiOperation({ summary: 'Refund a payment' })
    @ApiResponse({ 
      status: 201, 
      description: 'Payment refunded successfully',
    })
    refundPayment(@Body() dto: RefundPaymentDto) {
      return this.paymentService.refundPayment(dto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all payments' })
    @ApiResponse({ 
      status: 200, 
      description: 'Returns all payments',
    })
    findAll() {
      return this.paymentService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get payment by ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'Returns payment by ID',
    })
    findById(@Param('id', ParseIntPipe) id: number) {
      return this.paymentService.findById(id);
    }
  }