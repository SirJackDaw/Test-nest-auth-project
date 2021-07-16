import { WinstonModule } from 'nest-winston';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {transports, format} from 'winston'
import { options } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(msg => `[ ${msg.timestamp} ] [ ${msg.level} ] — ${msg.message}`)
      ),
      transports: [
        new transports.Console(options.console),
        new transports.File(options.file),
        new transports.File(options.httpFile)
      ],
    })
  });
  // useRequestLogging(app);
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
