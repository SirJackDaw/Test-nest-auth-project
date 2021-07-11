import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as fs from 'fs'
import { keys } from "src/config/keys";

@Injectable()
export  class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: keys.publicKey,
            algorithms: ['RS256'],
            ignoreExpiration: false
        });
    }

    async validate(payload: any) {
        return {...payload.user}
    }
}
