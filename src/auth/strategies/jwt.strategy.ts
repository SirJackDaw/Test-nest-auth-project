import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as fs from 'fs'

@Injectable()
export  class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: fs.readFileSync('src/config/jwtRS256.key.pub', 'utf8'),
            algorithms: ['RS256'],
            ignoreExpiration: false
        });
    }

    async validate(payload: any) {
        return payload.user._id
    }
}
