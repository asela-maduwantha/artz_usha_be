// src/modules/products/entities/customization-option.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class CustomizationOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string; // e.g., 'color', 'size', 'material', 'text'

    @Column('simple-array', { nullable: true })
    available_values: string[];

    @Column({ nullable: true })
    min_value: number;

    @Column({ nullable: true })
    max_value: number;

    @Column({ nullable: true })
    additional_price: number;

    @Column()
    is_required: boolean;

    @ManyToOne(() => Product, (product) => product.customization_options)
    product: Product;
}