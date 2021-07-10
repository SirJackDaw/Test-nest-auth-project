import { Module, forwardRef } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { getJWTConfig } from 'src/config/jwt.config';
import { JwtAuthGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/roles.guard';
import { TypegooseModule } from 'nestjs-typegoose';
import { RefreshModel } from './refreshToken/refresh.model';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig
        }),
        TypegooseModule.forFeature([
            {
              typegooseClass: RefreshModel,
              schemaOptions: {
                collection: 'RefreshToken',
              },
            },
          ]),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
    exports: [AuthService]
})
export class AuthModule { }
