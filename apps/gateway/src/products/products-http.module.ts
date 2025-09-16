import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsHttpController } from './products.controller';
import { MS_PRODUCTS } from '@app/common';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: MS_PRODUCTS,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get('MS_PRODUCTS_HOST'),
                        port: cs.get<number>('MS_PRODUCTS_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [ProductsHttpController],
})
export class ProductsHttpModule { }
