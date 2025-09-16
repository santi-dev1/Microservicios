import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',  
      port: +process.env.PORT! || 4102, 
    },
  });
  await app.listen();
  console.log(`Products-MS is running on port ${process.env.PORT}`);
}
bootstrap();
