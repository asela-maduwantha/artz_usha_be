import { Orders } from "src/modules/orders/entity/orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Discounts{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    value: number;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    description: string;

    @Column()
    code: string;

    @Column()
    usage_limit: number;

    @Column()
    current_usage: number;
    
    @OneToMany(()=> Orders, (orders)=> orders.discount)
    orders: Orders[];
}