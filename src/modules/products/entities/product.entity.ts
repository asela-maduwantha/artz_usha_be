import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    category: string;

    @Column()
    is_customiziable: boolean;

    @Column()
    status: boolean;

    @CreateDateColumn()
    created_at: Date;


}