import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItem } from './entity/order-item.entity';
import { OrderItemCustomization } from './entity/order-item-customization.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Discounts } from 'src/modules/discounts/entity/discounts.entity';
import { CustomizationOption } from 'src/modules/products/entities/customization-option.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(OrderItemCustomization)
        private orderItemCustomizationRepository: Repository<OrderItemCustomization>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Discounts)
        private discountsRepository: Repository<Discounts>,
        @InjectRepository(CustomizationOption)
        private customizationOptionRepository: Repository<CustomizationOption>,
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
            user: user,
            discount: discount,
            order_date: createOrderDto.order_date,
            total_amount: createOrderDto.total_amount,
            discount_amount: createOrderDto.discount_amount || 0,
            status: createOrderDto.status,
            shipping_address: createOrderDto.shipping_address,
            order_items: []
        });

        // Save order first to get its ID
        const savedOrder = await this.ordersRepository.save(order);

        // Process order items and their customizations
        for (const itemDto of createOrderDto.order_items) {
            const product = await this.productRepository.findOne({ 
                where: { id: itemDto.product_id },
                relations: ['customization_options']
            });
            if (!product) {
                throw new NotFoundException(`Product with ID ${itemDto.product_id} not found`);
            }

            // Create order item
            const orderItem = this.orderItemRepository.create({
                order_id: savedOrder,
                product: product,
                quantity: itemDto.quantity
            });
            const savedOrderItem = await this.orderItemRepository.save(orderItem);

            // Process customizations
            for (const customizationDto of itemDto.customizations) {
                const customizationOption = await this.customizationOptionRepository.findOne({
                    where: { id: customizationDto.customization_option_id }
                });

                if (!customizationOption) {
                    throw new NotFoundException(
                        `Customization option with ID ${customizationDto.customization_option_id} not found`
                    );
                }

                // Validate if the customization belongs to the product
                if (!product.customization_options.some(opt => opt.id === customizationOption.id)) {
                    throw new Error(
                        `Customization option ${customizationOption.id} does not belong to product ${product.id}`
                    );
                }

                // Create customization record
                const orderItemCustomization = this.orderItemCustomizationRepository.create({
                    order_item: savedOrderItem,
                    customization_option: customizationOption,
                    selected_value: customizationDto.selected_value,
                    price_impact: customizationOption.additional_price || 0
                });

                await this.orderItemCustomizationRepository.save(orderItemCustomization);
            }
        }

        // Return complete order with all relations
        return this.findById(savedOrder.id);
    }

    async findAll(): Promise<Orders[]> {
        return this.ordersRepository.find({
            relations: [
                'user',
                'discount',
                'order_items',
                'order_items.product',
                'order_items.customizations',
                'order_items.customizations.customization_option'
            ]
        });
    }
    
    async findById(id: number): Promise<Orders> {
        const order = await this.ordersRepository.findOne({ 
            where: { id },
            relations: [
                'user',
                'discount',
                'order_items',
                'order_items.product',
                'order_items.customizations',
                'order_items.customizations.customization_option'
            ]
        });

    
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
    
        return order;
    }
    
    async findByUser(userId: number): Promise<Orders[]> {
        return this.ordersRepository.find({ 
            where: { user: { id: userId } },
            relations: ['user', 'discount', 'order_items', 'order_items.product']
        });
    }
    
    async findByStatus(status: OrderStatus): Promise<Orders[]> {
        return this.ordersRepository.find({ 
            where: { status },
            relations: ['user', 'discount', 'order_items', 'order_items.product']
        });
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

  
}