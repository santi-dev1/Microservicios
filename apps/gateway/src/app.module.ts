import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envSchema } from './config/envs';
import { MS_USERS, MS_PRODUCTS, MS_INVOICES } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UsersHttpModule } from './users/users-http.module';
import { ProductsHttpModule } from './products/products-http.module';
import { InvoicesHttpModule } from './invoices/invoices-http.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/gateway/.env',
            validationSchema: envSchema,     
        }),

        ClientsModule.registerAsync([
            {
                name: MS_USERS,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get<string>('MS_USERS_HOST'),
                        port: cs.get<number>('MS_USERS_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: MS_PRODUCTS,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get<string>('MS_PRODUCTS_HOST'),
                        port: cs.get<number>('MS_PRODUCTS_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: MS_INVOICES,
                imports: [ConfigModule],
                useFactory: (cs: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: cs.get<string>('MS_INVOICES_HOST'),
                        port: cs.get<number>('MS_INVOICES_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),

        AuthModule,
        UsersHttpModule,
        ProductsHttpModule,
        InvoicesHttpModule,
    ],
})
export class AppModule { }
