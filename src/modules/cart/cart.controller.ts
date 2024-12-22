import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Returns the user cart with items' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  async getCart(@Param('userId') userId: number) {
    return this.cartService.getOrCreateCart(userId);
  }

  @Post(':userId/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  async addItem(
    @Param('userId') userId: number,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartService.addItem(userId, createCartItemDto);
  }

  @Patch(':userId/items/:id')
  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Cart Item ID' })
  async updateItem(
    @Param('userId') userId: number,
    @Param('id') itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete(':userId/items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Cart Item ID' })
  async removeItem(
    @Param('userId') userId: number,
    @Param('id') itemId: number,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  async clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}