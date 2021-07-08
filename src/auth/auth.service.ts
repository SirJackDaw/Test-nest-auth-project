import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService){}

    generateJWT(user: UserModel): Promise<string> {
        return this.jwtService.signAsync({user});
    }

    hashPassword(password: string): Promise<string> {
        return hash(password, 12);

    }

    comparePasswords(newPassword: string, passwortHash: string): Promise<boolean>{
        return compare(newPassword, passwortHash);
    }

}
