import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/user-role.enum";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.BUYER
      })
    role: Role

    @CreateDateColumn ()
    created_at: Date
}