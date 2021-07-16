import { JwtModuleOptions } from "@nestjs/jwt";
import { keys } from "./keys";

export const getJWTConfig = async (): Promise<JwtModuleOptions> => {
    return {
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
        signOptions: {
            expiresIn: '10m',
            algorithm: 'RS256'
        }
    }
}
