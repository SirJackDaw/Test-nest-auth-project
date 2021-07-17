import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getMySqlConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: "mysql",
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
    host: configService.get('MYSQL_HOST'),
    port: configService.get('MYSQL_PORT'),
    username: configService.get('MYSQL_USERNAME'),
    password: configService.get('MYSQL_PASSWORD'),
    database: configService.get('MYSQL_DB'),
})
