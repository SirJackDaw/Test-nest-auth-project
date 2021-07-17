import {Logger, MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMySqlConfig } from './config/mysql.config';
import { AppLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.STAGE}`]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMySqlConfig
        }),
        UserModule],
    providers: [Logger]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
}}
