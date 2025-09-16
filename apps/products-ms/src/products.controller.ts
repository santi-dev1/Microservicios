import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';


@Controller()
export class ProductsController {
    constructor(private readonly service: ProductsService) { }


    @MessagePattern({ products: 'find-all' })
    findAll() { return this.service.findAll(); }


    @MessagePattern({ products: 'create' })
    create(@Payload() dto: any) { return this.service.create(dto); }


    @MessagePattern({ products: 'reserve' })
    reserve(@Payload() { userId, productId, qty }: any) { return this.service.reserve(+userId, +productId, +qty); }


    @MessagePattern({ products: 'confirm' })
    confirm(@Payload() { userId, items }: any) { return this.service.confirmOrder(+userId, items); }
}