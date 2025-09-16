import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';
import { MS_PRODUCTS } from '@app/common';
import { firstValueFrom } from 'rxjs';


@Controller()
export class InvoicesController {
    constructor(
        private readonly service: InvoicesService,
        @Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy,
    ) { }


    @MessagePattern({ invoices: 'create' })
    async create(@Payload() dto: { userId: number; items: { productId: number; qty: number; price: number }[] }) {
        // confirmar y descontar stock
        await firstValueFrom(this.productsClient.send({ products: 'confirm' }, { userId: dto.userId, items: dto.items }));
        return this.service.create(dto);
    }


    @MessagePattern({ invoices: 'find-all' })
    findAll() { return this.service.findAll(); }
}