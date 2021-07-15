import {Logger, MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypegooseModule} from "nestjs-typegoose";
import {getMongoConfig} from "./config/mongoConfig";
import { AppLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypegooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig
        }),
        UserModule],
    providers: [Logger]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
}}
