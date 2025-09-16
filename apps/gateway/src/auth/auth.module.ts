import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_USERS } from '@app/common';

@Module({
    imports: [
        PassportModule,
        ConfigModule, 
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (cs: ConfigService) => ({
                secret: cs.get('JWT_SECRET'),
                signOptions: { expiresIn: cs.get('JWT_EXPIRES') },
            }),
            inject: [ConfigService],
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
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
