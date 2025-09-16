import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaService } from './prisma/prisma.service';
import { MS_PRODUCTS } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ClientsModule.registerAsync([
            {
                name: MS_PRODUCTS,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get('MS_PRODUCTS_HOST') || '127.0.0.1',
                        port: cs.get<number>('MS_PRODUCTS_PORT') || 4102,
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [InvoicesController],
    providers: [InvoicesService, PrismaService],
})
export class AppModule { }
