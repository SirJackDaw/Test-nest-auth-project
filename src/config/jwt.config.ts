import { JwtModuleOptions } from "@nestjs/jwt";
import * as fs from 'fs'
import { keys } from "./keys";

export const getJWTConfig = async (): Promise<JwtModuleOptions> => {
    return {
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
        signOptions: {
            expiresIn: '10000s',
            algorithm: 'RS256'
        }
    }
}
