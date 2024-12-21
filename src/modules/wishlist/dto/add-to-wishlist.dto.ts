import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ description: 'Product ID to add to wishlist' })
  @IsNumber()
  productId: number;
}