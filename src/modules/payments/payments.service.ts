import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from './entities/payments.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CompletePaymentDto } from './dto/complete-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderStatus } from '../orders/enums/order-status.enum';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payments)
    private paymentRepository: Repository<Payments>,
    private orderService: OrdersService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: dto.amount,
        currency: 'usd',
        metadata: {
          user_id: dto.user_id.toString(),
          order_items: JSON.stringify(dto.order_items),
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async completePayment(dto: CompletePaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      dto.payment_intent_id
    );

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not successful');
    }

    const orderDto = {
      user_id: parseInt(paymentIntent.metadata.user_id),
      order_date: new Date(),
      total_amount: paymentIntent.amount / 100,
      status: OrderStatus.CONFIRMED,
      shipping_address: '',
      order_items: JSON.parse(paymentIntent.metadata.order_items),
    };

    const order = await this.orderService.create(orderDto);

    const payment = this.paymentRepository.create({
      order: order,
      user: { id: parseInt(paymentIntent.metadata.user_id) },
      payment_method: paymentIntent.payment_method_types[0],
      amount: paymentIntent.amount / 100,
      payment_date: new Date(),
      stripe_id: paymentIntent.id,
      status: PaymentStatus.COMPLETED,
    });

    return this.paymentRepository.save(payment);
  }

  async refundPayment(dto: RefundPaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id: dto.payment_id },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    try {
      // Create refund with correct types
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: payment.stripe_id,
        amount: dto.amount,
        reason: dto.reason as Stripe.RefundCreateParams.Reason, // Cast to valid refund reason
      };

      const refund = await this.stripe.refunds.create(refundParams);

      payment.status = PaymentStatus.REFUNDED;
      await this.paymentRepository.save(payment);

      await this.orderService.updateStatus(payment.order.id, OrderStatus.CANCELLED);

      return refund;
    } catch (error) {
      throw new BadRequestException('Failed to process refund');
    }
  }

  async findAll() {
    return this.paymentRepository.find({
      relations: ['user', 'order'],
    });
  }

  async findById(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}