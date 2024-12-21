import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { OrderItemCustomization } from "./order-item-customization.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Orders, (orders) => orders.id)
    order_id: Orders;

    @ManyToOne(() => Product, (product) => product.id)
    product_id: Product;

    @Column()
    quantity: number;

    @OneToMany(() => OrderItemCustomization, (customization) => customization.order_item)
    customizations: OrderItemCustomization[];
}