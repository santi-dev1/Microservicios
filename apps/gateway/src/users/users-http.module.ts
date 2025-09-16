import { Module } from '@nestjs/common';
import { UsersHttpController } from './users-http.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_USERS } from '@app/common';

@Module({
    imports: [
        ConfigModule,
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
        ]),
    ],
    controllers: [UsersHttpController],
})
export class UsersHttpModule { }
