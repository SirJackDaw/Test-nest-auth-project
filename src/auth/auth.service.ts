import { Types } from 'mongoose';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { UserModel } from 'src/user/user.model';
import { RefreshModel } from './refreshToken/refresh.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(RefreshModel) private readonly refreshModel: ModelType<RefreshModel>,
        private readonly jwtService: JwtService)
    {}


    async generateJWT(user: UserModel) {
        const accessToken = await this.jwtService.signAsync({user});
        const refreshToken = await this.generateRefresh(user)
        return {
            access_token: accessToken,
            refresh_token: refreshToken.refreshToken
        }
    }

    async generateRefresh(user: UserModel): Promise<RefreshModel> {
        const token = await this.jwtService.signAsync({user}, {expiresIn: '1h'});
        return this.saveToken(user._id, token);
    }

    async saveToken(userId: Types.ObjectId, refreshToken: string): Promise<RefreshModel> {
        const token = await this.refreshModel.findOne({ userId }).exec()
        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }
        return this.refreshModel.create({userId, refreshToken})
    }

    async verifyToken(token): Promise<UserModel> {
        let data;
        try {
            data = await this.jwtService.verify(token);
        } catch (e) {
            throw new BadRequestException()
        }
        if (Date.now() >= data.exp * 1000) {
            throw new UnauthorizedException()
        }
        const tokenExist = await this.tokenExist(data.user._id, token)
        if (!tokenExist) {
            throw new UnauthorizedException()
        }
        return data;
    }

    async tokenExist(userId, token): Promise<boolean>{
        return this.refreshModel.exists({userId: userId, refreshToken: token})
    }

    hashPassword(password: string): Promise<string> {
        return hash(password, 12);

    }

    comparePasswords(newPassword: string, passwortHash: string): Promise<boolean>{
        return compare(newPassword, passwortHash);
    }
}
