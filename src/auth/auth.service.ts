import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
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

    async getToken(userId: Types.ObjectId) {

    }

    hashPassword(password: string): Promise<string> {
        return hash(password, 12);

    }

    comparePasswords(newPassword: string, passwortHash: string): Promise<boolean>{
        return compare(newPassword, passwortHash);
    }
}
