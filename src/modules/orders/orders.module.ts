import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItem } from './entity/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Discounts } from '../discounts/entity/discounts.entity';
import { CustomizationOption } from '../products/entities/customization-option.entity';
import { OrderItemCustomization } from './entity/order-item-customization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders, 
      OrderItem, 
      OrderItemCustomization,
      User, 
      Product, 
      Discounts,
      CustomizationOption
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}