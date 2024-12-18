import { Discounts } from "src/modules/discounts/entity/discounts.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Orders{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, (user)=>user.id)
    user_id: User;

    @OneToOne(()=> Discounts, (discounts)=>discounts.id)
    discount_id: Discounts;

    @Column()
    order_date: Date;

    @Column()
    total_amount: number;

    @Column()
    discount_amount: number;

    @Column()
    status: OrderStatus;

    @Column()
    shipping_address: string;

    @OneToMany(()=>OrderItem, (orderItem)=> orderItem.product_id)
    order_items: OrderItem[];
    
}