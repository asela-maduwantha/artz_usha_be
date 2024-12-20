// src/modules/products/entities/product.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductFeature } from "./product-feature.entity";
import { CustomizationOption } from "./customization-option.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    img_url: string;

    @Column()
    price: number;

    @Column()
    category: string;

    @Column()
    is_customizable: boolean;

    @Column()
    is_active: boolean;

    @OneToMany(() => ProductFeature, (feature) => feature.product)
    features: ProductFeature[];

    @OneToMany(() => CustomizationOption, (option) => option.product)
    customization_options: CustomizationOption[];
}