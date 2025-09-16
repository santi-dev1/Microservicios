import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards';
import { MS_USERS } from '@app/common';


@Controller('users')
export class UsersHttpController {
    constructor(@Inject(MS_USERS) private readonly client: ClientProxy) { }


    @Post('register')
    async register(@Body() dto: any) {
        return firstValueFrom(this.client.send({ users: 'register' }, dto));
    }


    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return firstValueFrom(this.client.send({ users: 'find-one' }, { id: +id }));
    }
}