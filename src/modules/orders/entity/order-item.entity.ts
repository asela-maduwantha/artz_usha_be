import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Product } from "src/modules/products/entities/product.entity";

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=> Orders, (orders)=>orders.id)
    order_id: Orders;

    @OneToOne(()=>Product, (product)=>product.id)
    product_id: Product;

    @Column()
    quantity: number;

}