import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoicesHttpController } from './invoices.controller';
import { MS_INVOICES, MS_USERS } from '@app/common';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: MS_INVOICES,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get('MS_INVOICES_HOST'),
                        port: cs.get<number>('MS_INVOICES_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: MS_USERS,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get('MS_USERS_HOST'),
                        port: cs.get<number>('MS_USERS_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [InvoicesHttpController],
})
export class InvoicesHttpModule { }
