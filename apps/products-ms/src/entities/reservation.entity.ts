import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';


@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn() id: number;
    @Column() userId: number;
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;
    @Column() productId: number;
    @Column('int') qty: number;
    @CreateDateColumn() createdAt: Date; // limpiar > 3 dias
}