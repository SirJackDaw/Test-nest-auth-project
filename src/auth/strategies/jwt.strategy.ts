import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { keys } from "src/config/keys";

@Injectable()
export  class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const config = new ConfigService()
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: keys.publicKey,
            algorithms: [config.get('JWT_CRYPT_ALGORYTHM')],
            ignoreExpiration: false
        });
    }

    async validate(payload: any) {
        return {...payload.user}
    }
}
