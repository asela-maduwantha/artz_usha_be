import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { CustomizationOption } from "src/modules/products/entities/customization-option.entity";


@Entity()
export class OrderItemCustomization {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderItem, (orderItem) => orderItem.customizations)
    order_item: OrderItem;

    @ManyToOne(() => CustomizationOption)
    customization_option: CustomizationOption;

    @Column('text')
    selected_value: string;  
    
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_impact: number;   
}