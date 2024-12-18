import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/user-role.enum";
import { Payments } from "src/modules/payments/entities/payments.entity";
import { Orders } from "src/modules/orders/entity/orders.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.BUYER
      })
    role: Role

    @OneToMany(()=> Payments, (payment)=>payment.user)
    payments: Payments[];

    @OneToMany(()=> Orders, (orders)=>orders.user)
    orders: Orders[];

    @CreateDateColumn ()
    created_at: Date
}