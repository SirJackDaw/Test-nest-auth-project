import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './refreshToken/refresh.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(RefreshToken) private readonly refreshRepo: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService)
    {}

    async generateJWT(user: User) {
        const accessToken = await this.jwtService.signAsync({user});
        const refreshToken = await this.generateRefresh(user)
        return {
            access_token: accessToken,
            refresh_token: refreshToken.token
        }
    }

    async generateRefresh(user: User): Promise<RefreshToken> {
        const token = await this.jwtService.signAsync({user}, {expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRY')});
        return this.saveToken(user.id, token);
    }

    async saveToken(userId: number, refreshToken: string): Promise<RefreshToken> {
        const oldToken = await this.refreshRepo.findOne({ userId })
        if (oldToken) {
            oldToken.token = refreshToken;
            await this.refreshRepo.save(oldToken)
            return oldToken;
        }
        const newToken =  this.refreshRepo.create({ userId, token: refreshToken })
        await this.refreshRepo.save(newToken)
        return newToken
    }

    async verifyToken(token): Promise<User> {
        let data;
        try {
            data = await this.jwtService.verify(token);
        } catch (e) {
            if (e.message == 'jwt expired') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }
        const tokenExist = await this.tokenExist(data.user.id, token)
        if (!tokenExist) {
            throw new UnauthorizedException()
        }
        return data.user;
    }

    async tokenExist(userId, token): Promise<boolean>{
        const oldToken = await this.refreshRepo.findOne({userId, token})
        return oldToken ? true : false;
    }

    hashPassword(password: string): Promise<string> {
        return hash(password, 12);

    }

    comparePasswords(newPassword: string, passwortHash: string): Promise<boolean>{
        return compare(newPassword, passwortHash);
    }
}
