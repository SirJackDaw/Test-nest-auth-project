import { Module } from '@nestjs/common';
import { JwtModule, JwtService} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { getJWTConfig } from 'src/config/jwt.config';
import { JwtAuthGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refreshToken/refresh.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([RefreshToken]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig
        }),
        ConfigModule
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
    exports: [AuthService]
})
export class AuthModule { }
