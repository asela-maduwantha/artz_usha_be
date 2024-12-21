import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
  } from '@nestjs/common';
  import { WishlistService } from './wishlist.service';
  import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Wishlist')
  @Controller('wishlist')
  export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}
  
    @Get(':userId')
    @ApiOperation({ summary: 'Get user wishlist' })
    @ApiResponse({ 
      status: 200, 
      description: 'Returns the user wishlist with items'
    })
    async getWishlist(@Param('userId') userId: number) {
      return this.wishlistService.getOrCreateWishlist(userId);
    }
  
    @Post(':userId/items')
    @ApiOperation({ summary: 'Add item to wishlist' })
    @ApiResponse({ 
      status: 201, 
      description: 'Item added to wishlist successfully' 
    })
    async addItem(
      @Param('userId') userId: number,
      @Body() addToWishlistDto: AddToWishlistDto,
    ) {
      return this.wishlistService.addItem(userId, addToWishlistDto);
    }
  
    @Delete(':userId/items/:itemId')
    @ApiOperation({ summary: 'Remove item from wishlist' })
    @ApiResponse({ 
      status: 200, 
      description: 'Item removed from wishlist successfully' 
    })
    async removeItem(
      @Param('userId') userId: number,
      @Param('itemId') itemId: number,
    ) {
      return this.wishlistService.removeItem(userId, itemId);
    }
  
    @Delete(':userId')
    @ApiOperation({ summary: 'Clear wishlist' })
    @ApiResponse({ 
      status: 200, 
      description: 'Wishlist cleared successfully' 
    })
    async clearWishlist(@Param('userId') userId: number) {
      return this.wishlistService.clearWishlist(userId);
    }
  
    @Get(':userId/check/:productId')
    @ApiOperation({ summary: 'Check if product is in wishlist' })
    @ApiResponse({ 
      status: 200, 
      description: 'Returns boolean indicating if product is in wishlist' 
    })
    async checkProduct(
      @Param('userId') userId: number,
      @Param('productId') productId: number,
    ) {
      return this.wishlistService.isProductInWishlist(userId, productId);
    }
  }