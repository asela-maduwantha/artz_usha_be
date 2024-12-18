import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItem } from './entity/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Discounts } from '../discounts/entity/discounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders, 
      OrderItem, 
      User, 
      Product, 
      Discounts
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}