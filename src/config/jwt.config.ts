import { JwtModuleOptions } from "@nestjs/jwt";
import * as fs from 'fs'

export const getJWTConfig = async (): Promise<JwtModuleOptions> => {
    return {
        secret: fs.readFileSync('src/config/jwtRS256.key', 'utf8'),
        signOptions: {
            expiresIn: '10000s',
            algorithm: 'RS256'
        }
    }
}
