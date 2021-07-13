import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { WinstonModule } from 'nest-winston';
import {transports} from 'winston'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logger.log' }),
        new transports.File({ filename: 'http.log', level: 'warn' })
      ],
    })
  });
  const config = new DocumentBuilder()
      .setTitle('Test nest service')
      .setDescription('Test nest service API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
