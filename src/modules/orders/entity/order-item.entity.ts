import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { OrderItemCustomization } from "./order-item-customization.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    product: Product;


    @Column()
    quantity: number;

    @ManyToOne(() => Orders, (orders) => orders.order_items)
    order_id: Orders;       

    @OneToMany(() => OrderItemCustomization, (customization) => customization.order_item)
    customizations: OrderItemCustomization[];
}