import { Orders } from "src/modules/orders/entity/orders.entity";
import { Column, Entity, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../enums/payment-status.enum";
import { User } from "src/modules/users/entities/user.entity";

@Entity()
export class Payments {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Orders, (orders) => orders.payment)
    @JoinColumn({ name: 'order_id' })  // Add this to specify the foreign key column
    order: Orders;

    @ManyToOne(() => User, (user) => user.payments)
    @JoinColumn({ name: 'user_id' })  // Add this to specify the foreign key column
    user: User;

    @Column()
    payment_method: string;

    @Column('decimal', { precision: 10, scale: 2 })  // Specify precision for monetary values
    amount: number;

    @Column()
    payment_date: Date;

    @Column()
    stripe_id: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;
}