import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductFeature{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tag: string;

    @Column()
    description: string;

    @Column()
    icon: string;

    @ManyToOne(()=>Product, (product)=> product.features, {onDelete:'CASCADE'})
    product: Product;
}