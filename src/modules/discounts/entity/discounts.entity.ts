import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}