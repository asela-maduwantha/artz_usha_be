import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId },
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepository.findOne({
      where: { id: createCartItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cartItem = this.cartItemRepository.create({
      cart,
      product,
      quantity: createCartItemDto.quantity,
      customization_data: createCartItemDto.customization_data,
    });

    await this.cartItemRepository.save(cartItem);
    return this.getOrCreateCart(userId);
  }

  async updateItem(
    userId: number,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = cart.items.find(item => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const updateData: Partial<CartItem> = {};

    if (typeof updateCartItemDto.quantity !== 'undefined') {
      updateData.quantity = updateCartItemDto.quantity;
    }

    if (updateCartItemDto.customization_data) {
      updateData.customization_data = updateCartItemDto.customization_data;
    }

    await this.cartItemRepository.update(itemId, updateData);
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: number, itemId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = cart.items.find(item => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.remove(cart.items);
  }
}