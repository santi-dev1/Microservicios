import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn() id: number;
    @Column() name: string;
    @Column('decimal', { precision: 10, scale: 2 }) price: number;
    @Column('int', { default: 0 }) stock: number;
    @CreateDateColumn() createdAt: Date;
    @UpdateDateColumn() updatedAt: Date;
}