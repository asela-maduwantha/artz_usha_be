import { registerAs } from '@nestjs/config';
import { CartItem } from 'src/modules/cart/entities/cart-item.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Discounts } from 'src/modules/discounts/entity/discounts.entity';
import { OrderItemCustomization } from 'src/modules/orders/entity/order-item-customization.entity';
import { OrderItem } from 'src/modules/orders/entity/order-item.entity';
import { Orders } from 'src/modules/orders/entity/orders.entity';
import { Payments } from 'src/modules/payments/entities/payments.entity';
import { CustomizationOption } from 'src/modules/products/entities/customization-option.entity';
import { ProductFeature } from 'src/modules/products/entities/product-feature.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { WishlistItem } from 'src/modules/wishlist/entities/wishlist-item.entity';
import { Wishlist } from 'src/modules/wishlist/entities/wishlist.entity';

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
    CustomizationOption,
    Orders,
    OrderItem,
    Discounts,
    Payments,
    OrderItemCustomization,
    Wishlist,
    WishlistItem,
    Cart,
    CartItem
  ],
  synchronize: true,
}));