import {Logger, MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        UserModule],
    providers: [Logger]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
}}
