import { Discounts } from "src/modules/discounts/entity/discounts.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItem } from "./order-item.entity";
import { Payments } from "src/modules/payments/entities/payments.entity";

@Entity()
export class Orders{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, (user)=>user.orders)
    user: User;

    @ManyToOne(()=> Discounts, (discounts)=>discounts.orders)
    discount: Discounts;

    @Column()
    order_date: Date;

    @Column()
    total_amount: number;

    @Column()
    discount_amount: number;

    
        @Column({
            type: 'enum',
            enum: OrderStatus,
            default: OrderStatus.PENDING
          })
    status: OrderStatus;

    @Column()
    shipping_address: string;

    @OneToOne(()=>Payments, (payment)=> payment.order)
    payment: Payments;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order_id)
    order_items: OrderItem[];
}