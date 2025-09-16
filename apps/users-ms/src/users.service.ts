import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async register(dto: any) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) {
            throw new RpcException({ statusCode: HttpStatus.CONFLICT, error: 'Email in use' });
        }

        const password = await bcrypt.hash(dto.password, +process.env.BCRYPT_SALT! || 10);
        const user = await this.prisma.user.create({ data: { ...dto, password } });

        const { password: _, ...rest } = user;
        return rest;
    }

    async validate(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return { id: user.id, email: user.email };
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new RpcException({ statusCode: 404, error: 'Not found' });
        }

        const { password: _, ...rest } = user;
        return rest;
    }

    async ensureCart(userId: number) {
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }
        return cart;
    }

    async addToCart(userId: number, productId: number, qty: number) {
        const cart = await this.ensureCart(userId);
        return this.prisma.cartItem.create({ data: { cartId: cart.id, productId, qty } });
    }

    getCart(userId: number) {
        return this.prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    }
}
