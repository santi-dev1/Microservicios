import { Controller, Get, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards';
import { MS_PRODUCTS } from '@app/common';

@Controller('products')
export class ProductsHttpController {
    constructor(
        @Inject(MS_PRODUCTS) private readonly client: ClientProxy,
    ) { }

    @Get()
    async findAll() {
        return firstValueFrom(
            this.client.send({ products: 'find-all' }, {}),
        );
    }

    @Post()
    async create(@Body() dto: { name: string; price: number; stock: number }) {
        return firstValueFrom(
            this.client.send({ products: 'create' }, dto),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('reserve')
    async reserve(
        @Body() dto: { userId: number; productId: number; qty: number },
    ) {
        return firstValueFrom(
            this.client.send({ products: 'reserve' }, dto),
        );
    }
}