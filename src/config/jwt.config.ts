import { JwtModuleOptions } from "@nestjs/jwt";

export const getJWTConfig = async (): Promise<JwtModuleOptions> => {
    return {
        secret: 'test',
        signOptions: {expiresIn: '10000s'}
    }
}
