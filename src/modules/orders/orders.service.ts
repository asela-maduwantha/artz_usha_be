import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Discounts } from 'src/modules/discounts/entity/discounts.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Discounts)
    private discountsRepository: Repository<Discounts>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Orders> {
    // Validate user
    const user = await this.userRepository.findOne({ 
      where: { id: createOrderDto.user_id } 
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createOrderDto.user_id} not found`);
    }

    // Validate discount if provided
    let discount = null;
    if (createOrderDto.discount_id) {
      discount = await this.discountsRepository.findOne({ 
        where: { id: createOrderDto.discount_id } 
      });
      if (!discount) {
        throw new NotFoundException(`Discount with ID ${createOrderDto.discount_id} not found`);
      }
    }

    // Create order
    const order = this.ordersRepository.create({
      user_id: user,
      discount_id: discount,
      order_date: createOrderDto.order_date,
      total_amount: createOrderDto.total_amount,
      discount_amount: createOrderDto.discount_amount || 0,
      status: createOrderDto.status,
      shipping_address: createOrderDto.shipping_address,
      order_items: []
    });

    // Validate and create order items
    const orderItems = [];
    for (const itemDto of createOrderDto.order_items) {
      const product = await this.productRepository.findOne({ 
        where: { id: itemDto.product_id } 
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.product_id} not found`);
      }

      const orderItem = this.orderItemRepository.create({
        order_id: order,
        product_id: product,
        quantity: itemDto.quantity
      });
      orderItems.push(orderItem);
    }

    order.order_items = orderItems;

    // Save order and order items
    await this.ordersRepository.save(order);
    await this.orderItemRepository.save(orderItems);

    return order;
  }

  async findAll(): Promise<Orders[]> {
    return this.ordersRepository.find({
      relations: ['user_id', 'discount_id', 'order_items', 'order_items.product_id']
    });
  }

  async findById(id: number): Promise<Orders> {
    const order = await this.ordersRepository.findOne({ 
      where: { id },
      relations: ['user_id', 'discount_id', 'order_items', 'order_items.product_id']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Orders> {
    const order = await this.findById(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findByUser(userId: number): Promise<Orders[]> {
    return this.ordersRepository.find({ 
      where: { user_id: { id: userId } },
      relations: ['user_id', 'discount_id', 'order_items', 'order_items.product_id']
    });
  }

  async findByStatus(status: OrderStatus): Promise<Orders[]> {
    return this.ordersRepository.find({ 
      where: { status },
      relations: ['user_id', 'discount_id', 'order_items', 'order_items.product_id']
    });
  }
}