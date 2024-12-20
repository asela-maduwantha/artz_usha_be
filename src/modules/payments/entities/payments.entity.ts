import { Orders } from "src/modules/orders/entity/orders.entity";
import { Column, Entity, ManyToOne, OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../enums/payment-status.enum";
import { User } from "src/modules/users/entities/user.entity";

@Entity()
export class Payments{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>Orders, (orders)=> orders.payment)
    order: Orders;

    @ManyToOne(()=> User , (user)=>user.payments)
    user: User;

    @Column()
    payment_method: string;

    @Column()
    amount: number;

    @Column()
    payment_date: Date;

    @Column()
    stripe_id: string;

    @Column(
        {type:'enum',
        enum: PaymentStatus,
        default : PaymentStatus.PENDING}
    )
    status: PaymentStatus;
}