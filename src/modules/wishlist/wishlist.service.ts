import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private wishlistItemRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getOrCreateWishlist(userId: number): Promise<Wishlist> {
    let wishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!wishlist) {
      wishlist = this.wishlistRepository.create({
        user: { id: userId },
        items: [],
      });
      await this.wishlistRepository.save(wishlist);
    }

    return wishlist;
  }

  async addItem(userId: number, addToWishlistDto: AddToWishlistDto): Promise<Wishlist> {
    const wishlist = await this.getOrCreateWishlist(userId);
    const product = await this.productRepository.findOne({
      where: { id: addToWishlistDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product.id === product.id,
    );

    if (!existingItem) {
      const wishlistItem = this.wishlistItemRepository.create({
        wishlist,
        product,
      });
      await this.wishlistItemRepository.save(wishlistItem);
    }

    return this.getOrCreateWishlist(userId);
  }

  async removeItem(userId: number, itemId: number): Promise<Wishlist> {
    const wishlist = await this.getOrCreateWishlist(userId);
    const wishlistItem = wishlist.items.find(item => item.id === itemId);

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.wishlistItemRepository.remove(wishlistItem);
    return this.getOrCreateWishlist(userId);
  }

  async clearWishlist(userId: number): Promise<void> {
    const wishlist = await this.getOrCreateWishlist(userId);
    await this.wishlistItemRepository.remove(wishlist.items);
  }

  async isProductInWishlist(userId: number, productId: number): Promise<boolean> {
    const wishlist = await this.getOrCreateWishlist(userId);
    return wishlist.items.some(item => item.product.id === productId);
  }
}