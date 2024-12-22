import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Payments } from './entities/payments.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CompletePaymentDto } from './dto/complete-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payments)
    private paymentRepository: Repository<Payments>,
    private orderService: OrdersService,
    private configService: ConfigService,
    private usersService: UsersService,
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

    // Start a transaction
    const queryRunner = this.paymentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userId = parseInt(paymentIntent.metadata.user_id);
      const user = await this.usersService.findById(userId);

      // Create the order
      const orderDto = {
        user_id: userId,
        order_date: new Date(),
        total_amount: paymentIntent.amount / 100,
        status: OrderStatus.CONFIRMED,
        shipping_address: '',
        order_items: JSON.parse(paymentIntent.metadata.order_items),
      };

      const order = await this.orderService.create(orderDto);

      const payment = new Payments();
      payment.order = order;
      payment.user = user;
      payment.payment_method = paymentIntent.payment_method_types[0];
      payment.amount = paymentIntent.amount / 100;
      payment.payment_date = new Date();
      payment.stripe_id = paymentIntent.id;
      payment.status = PaymentStatus.COMPLETED;

      const savedPayment = await queryRunner.manager.save(payment);
      
      await queryRunner.commitTransaction();
      
      return savedPayment;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      console.error('Payment creation error:', error);
      throw new BadRequestException('Failed to save payment record');
    } finally {
      await queryRunner.release();
    }
}

  async refundPayment(dto: RefundPaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id: dto.payment_id } as FindOptionsWhere<Payments>,
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: payment.stripe_id,
        amount: dto.amount,
        reason: dto.reason as Stripe.RefundCreateParams.Reason,
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
      where: { id: id } as FindOptionsWhere<Payments>,
      relations: ['user', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}