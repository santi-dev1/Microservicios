import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards';
import { MS_INVOICES, MS_USERS } from '@app/common';


@Controller('invoices')
export class InvoicesHttpController {
    constructor(
        @Inject(MS_INVOICES) private readonly invClient: ClientProxy,
        @Inject(MS_USERS) private readonly usersClient: ClientProxy,
    ) { }


    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: { userId: number; items: { productId: number; qty: number; price: number }[] }) {
        return firstValueFrom(this.invClient.send({ invoices: 'create' }, dto));
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        const invoices: any[] = await firstValueFrom(
            this.invClient.send({ invoices: 'find-all' }, {}),
        );
        const userIds = Array.from(new Set(invoices.map(i => i.userId)));
        const users = await Promise.all(
            userIds.map(id => firstValueFrom(this.usersClient.send({ users: 'find-one' }, { id })))
        );
        const map = new Map(users.map(u => [u.id, u]));
        return invoices.map(i => ({ ...i, user: map.get(i.userId) }));
    }
}