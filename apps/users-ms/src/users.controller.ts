import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly service: UsersService) { }

    
    @MessagePattern({ users: 'register' })
    register(@Payload() dto: any) {
        return this.service.register(dto);
    }

    
    @MessagePattern({ users: 'validate' })
    validate(@Payload() { email, password }: any) {
        return this.service.validate(email, password);
    }

    
    @MessagePattern({ cmd: 'validate_user' })
    validateUser(@Payload() { email, password }: any) {
        return this.service.validate(email, password);
    }

    
    @MessagePattern({ users: 'find-one' })
    findOne(@Payload() { id }: any) {
        return this.service.findOne(+id);
    }

    
    @MessagePattern({ users: 'add-to-cart' })
    addToCart(@Payload() { userId, productId, qty }: any) {
        return this.service.addToCart(+userId, +productId, +qty);
    }

    
    @MessagePattern({ users: 'get-cart' })
    getCart(@Payload() { userId }: any) {
        return this.service.getCart(+userId);
    }
}
