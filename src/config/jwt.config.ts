import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from "@nestjs/jwt";
import { keys } from "./keys";

export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
    return {
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
        signOptions: {
            expiresIn: configService.get('ACCESS_TOKEN_EXPIRY'),
            algorithm: configService.get('JWT_CRYPT_ALGORYTHM')
        }
    }
}
