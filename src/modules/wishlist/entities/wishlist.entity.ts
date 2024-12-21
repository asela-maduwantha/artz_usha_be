import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.wishlist, {
    cascade: true,
  })
  items: WishlistItem[];
}