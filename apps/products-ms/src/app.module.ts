import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Reservation } from './entities/reservation.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/products-ms/.env'}),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (cs: ConfigService) => {
                console.log('DB_USER:', cs.get('DB_USER'));
                console.log('DB_PASS:', cs.get('DB_PASS'));
                return {
                    type: 'mysql',
                    host: cs.get('DB_HOST'),
                    port: +cs.get('DB_PORT'),
                    username: cs.get('DB_USER'),
                    password: cs.get('DB_PASS'),
                    database: cs.get('DB_NAME'),
                    synchronize: true,
                    entities: [Product, Reservation],
                };
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Product, Reservation]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class AppModule { }