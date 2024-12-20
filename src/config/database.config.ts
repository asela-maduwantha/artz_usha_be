import { registerAs } from '@nestjs/config';
import { Discounts } from 'src/modules/discounts/entity/discounts.entity';
import { OrderItem } from 'src/modules/orders/entity/order-item.entity';
import { Orders } from 'src/modules/orders/entity/orders.entity';
import { Payments } from 'src/modules/payments/entities/payments.entity';
import { ProductFeature } from 'src/modules/products/entities/product-feature.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities:[
    User, 
    Product,
    ProductFeature,
    Orders,
    OrderItem,
    Discounts,
    Payments
  ],
  synchronize: true,
}));