import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Product } from './entities/product.entity';
import { Reservation } from './entities/reservation.entity';
import { RpcException } from '@nestjs/microservices';
import * as cron from 'node-cron';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private products: Repository<Product>,
        @InjectRepository(Reservation) private reservations: Repository<Reservation>,
    ) {
        // Limpieza cada noche 02:00
        cron.schedule('0 2 * * *', async () => {
            const limit = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);
            await this.reservations.delete({ createdAt: MoreThan(new Date(0)) });
            // buscar y borrar manualmente
            const olds = await this.reservations.find();
            await this.reservations.remove(olds.filter(r => r.createdAt < limit));
        });
    }


    findAll() { return this.products.find(); }
    create(dto: any) { return this.products.save(this.products.create(dto)); }


    async reserve(userId: number, productId: number, qty: number) {
        const p = await this.products.findOne({ where: { id: productId } });
        if (!p) throw new RpcException({ statusCode: 404, error: 'Product not found' });
        // comprobar stock disponible
        const reserved = (await this.reservations.find({ where: { productId } }))
            .reduce((acc, r) => acc + r.qty, 0);
        const available = p.stock - reserved;
        if (available < qty) throw new RpcException({ statusCode: HttpStatus.CONFLICT, error: 'Not enough stock' });
        return this.reservations.save(this.reservations.create({ userId, productId, qty }));
    }


    async confirmOrder(userId: number, items: { productId: number; qty: number }[]) {
        for (const it of items) {
            const p = await this.products.findOne({ where: { id: it.productId } });
            if (!p || p.stock < it.qty) throw new RpcException({ statusCode: 409, error: 'Stock changed' });
            p.stock -= it.qty; await this.products.save(p);
        }
        // limpiar reservas del usuario para esos productos
        const all = await this.reservations.find({ where: { userId } });
        await this.reservations.remove(all.filter(r => items.some(i => i.productId === r.productId)));
        return { ok: true };
    }
}