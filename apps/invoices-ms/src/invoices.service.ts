import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';


@Injectable()
export class InvoicesService {
    constructor(private prisma: PrismaService) { }
    async create(dto: { userId: number; items: { productId: number; qty: number; price: number }[] }) {
        const total = dto.items.reduce((s, i) => s + i.qty * i.price, 0);
        return this.prisma.invoice.create({
            data: {
                userId: dto.userId,
                total,
                items: { create: dto.items.map(i => ({ productId: i.productId, qty: i.qty, price: i.price })) },
            },
            include: { items: true },
        });
    }
    findAll() { return this.prisma.invoice.findMany({ include: { items: true } }); }
}